import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { AuthenticatedUser } from '@Common';
import { PrismaService } from '../prisma';
import {
  BookingStatus,
  RevenueStatus,
  EventStatus,
  TransactionType,
} from 'src/generated/prisma/enums';
import { ConfirmBookingDto, CreateBookingDto } from './dto';
import { ConfigType } from '@nestjs/config';
import { appConfigFactory } from '@Config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentService } from '../payment/payment.service';
@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private PaymentService: PaymentService,
    @Inject(appConfigFactory.KEY)
    private appConfig: ConfigType<typeof appConfigFactory>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async releaseExpiredHolds() {
    const now = new Date();

    const result = await this.prisma.booking.updateMany({
      where: {
        status: BookingStatus.HOLD,
        holdExpiresAt: { lte: now },
      },
      data: {
        status: BookingStatus.EXPIRED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`${result.count} expired holds release kiye`);
    }
  }

  async createBooking(ctx: AuthenticatedUser, dto: CreateBookingDto) {
    return await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: dto.eventId },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.status !== EventStatus.ACTIVE) {
        throw new BadRequestException('Event is not active');
      }

      const now = new Date();
      if (event.startTime <= now) {
        throw new BadRequestException('Event already started');
      }

      if (dto.quantity <= 0) {
        throw new BadRequestException('Invalid quantity');
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayBookings = await tx.booking.aggregate({
        _sum: { quantity: true },
        where: {
          userId: ctx.id,
          eventId: dto.eventId,
          status: { in: [BookingStatus.HOLD, BookingStatus.CONFIRMED] },
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      });
      const maxTicketsPerDay = Number(this.appConfig.maxTicketsPerDay);
      const alreadyBookedToday = Number(todayBookings._sum.quantity ?? 0);

      if (alreadyBookedToday + dto.quantity > maxTicketsPerDay) {
        // const remaining = maxTicketsPerDay - alreadyBookedToday;
        throw new Error(
          `You can only book a maximum of ${maxTicketsPerDay} tickets per day for this event`,
        );
      }

      const holdTickets = await tx.booking.aggregate({
        _sum: { quantity: true },
        where: {
          eventId: dto.eventId,
          status: BookingStatus.HOLD,
          holdExpiresAt: { gt: now },
        },
      });

      const totalHold = Number(holdTickets._sum.quantity ?? 0);
      const totalTickets = event.ticketsSold + totalHold;
      const availableTickets = event.maxTickets - totalTickets;

      if (dto.quantity > availableTickets) {
        throw new Error('Not enough tickets available');
      }

      const price = Number(event.ticketPrice);
      const totalPrice = dto.quantity * price;

      const holdMinutes = this.appConfig.holdMinutes as number;
      const holdExpiresAt = new Date(Date.now() + holdMinutes * 60 * 1000);

      const booking = await tx.booking.create({
        data: {
          userId: ctx.id,
          eventId: dto.eventId,
          quantity: dto.quantity,
          totalPrice: totalPrice,
          status: BookingStatus.HOLD,
          holdExpiresAt: holdExpiresAt,
        },
      });

      return booking;
    });
  }

  async confirmBooking(ctx: AuthenticatedUser, dto: ConfirmBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: {
          id: dto.bookingId,
        },
        include: {
          user: {
            include: {
              wallet: true,
            },
          },
          event: true,
          transactions: true,
        },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }
      if (booking.userId !== ctx.id) {
        throw new Error('Unauthorized');
      }

      if (booking.status !== BookingStatus.HOLD) {
        throw new Error('Invalid booking status');
      }

      const isExpired =
        !booking.holdExpiresAt || booking.holdExpiresAt < new Date();

      if (isExpired) {
        throw new Error('Hold expired');
      }

      const totalBooked = await tx.booking.aggregate({
        _sum: { quantity: true },
        where: {
          eventId: booking.eventId,
          status: BookingStatus.CONFIRMED,
        },
      });

      const totalConfirmed = totalBooked._sum.quantity || 0;

      if (totalConfirmed + booking.quantity > booking.event.maxTickets) {
        throw new Error('Tickets sold out');
      }
      if (!booking.user.wallet) {
        throw new Error('Wallet not found');
      }

      const walletBalance = Number(booking.user.wallet.balance);
      const totalPrice = Number(booking.totalPrice);

      if (walletBalance < totalPrice) {
        throw new Error('Insufficient wallet balance');
      }

      await tx.wallet.update({
        where: { userId: ctx.id },
        data: {
          balance: {
            decrement: booking.totalPrice,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          userId: booking.userId,
          walletId: booking.user.wallet.id,
          bookingId: booking.id,
          amount: booking.totalPrice.toNumber(),
          type: TransactionType.DEBIT,
          description: 'Ticket booking',
        },
      });
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          holdExpiresAt: null,
        },
      });

      await tx.event.update({
        where: { id: booking.eventId },
        data: {
          ticketsSold: {
            increment: booking.quantity,
          },
        },
      });

      const totalAmount = Number(booking.totalPrice);

      if (
        isNaN(this.appConfig.adminPercent) ||
        isNaN(this.appConfig.managerPercent) ||
        isNaN(this.appConfig.platformFee)
      ) {
        throw new Error('Invalid env config');
      }

      const adminPercent = this.appConfig.adminPercent;
      const managerPercent = this.appConfig.managerPercent;

      const adminShare = (totalAmount * adminPercent) / 100;
      const managerShare = (totalAmount * managerPercent) / 100;

      if (adminPercent + managerPercent !== 100) {
        throw new Error('Invalid revenue config');
      }
      await tx.revenueShare.create({
        data: {
          bookingId: booking.id,
          eventId: booking.eventId,
          totalAmount: booking.totalPrice,
          adminPercent: adminPercent,
          managerPercent: managerPercent,
          adminShare: adminShare,
          managerShare: managerShare,
          status: RevenueStatus.SETTLED,
        },
      });
      await this.PaymentService.creditAdminShare(adminShare, booking.id);
      return {
        message: 'Booking confirmed successfully',
        booking: updatedBooking,
        transaction,
      };
    });
  }

  // async cancelBooking(ctx: AuthenticatedUser, dto: CancelBookingDto) {
  //   return this.prisma.$transaction(async (tx) => {
  //     const booking = await tx.booking.findUnique({
  //       where: { id: dto.bookingId },
  //     });

  //     if (!booking) {
  //       throw new NotFoundException('Booking not found');
  //     }

  //     if (
  //       booking.userId !== ctx.id &&
  //       ctx.type !== UserType.ADMIN &&
  //       ctx.type !== UserType.MANAGER
  //     ) {
  //       throw new ForbiddenException('You cannot cancel this booking');
  //     }

  //     if (booking.status === BookingStatus.CANCELLED) {
  //       throw new BadRequestException('Booking already cancelled');
  //     }

  //     if (booking.status === BookingStatus.EXPIRED) {
  //       throw new BadRequestException('Booking already EXPIRED ');
  //     }

  //     const update = await tx.booking.update({
  //       where: { id: dto.bookingId },
  //       data: {
  //         status: BookingStatus.CANCELLED,
  //       },
  //     });

  //     return {
  //       message: 'Booking cancelled successfully',
  //       update,
  //     };
  //   });
  // }
}
