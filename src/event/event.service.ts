import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateEventDto } from './dto/create-event-request.dto';
import { EventStatus } from 'src/generated/prisma/enums';
import { AuthenticatedUser, formatTimeHHMM } from '@Common';
import { UpdateEventStatusDto } from './dto/UpdateEventStatusDto-request.dto';
import {
  assertAdminOrManager,
  buildEventDateTimes,
  validateEventTimes,
  validateCapacity,
  findVenueConflict,
} from './helper';
@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(ctx: AuthenticatedUser, dto: CreateEventDto) {
    assertAdminOrManager(ctx);
    const { startTime, endTime } = buildEventDateTimes(
      dto.eventDate,
      dto.startTime,
      dto.endTime,
    );

    validateEventTimes(startTime, endTime);

    validateCapacity(dto.maxTickets, dto.venueTotalCapacity);

    const event = await this.prisma.$transaction(async (tx) => {
      const existingEvent = await findVenueConflict(
        tx,
        dto,
        startTime,
        endTime,
      );

      if (existingEvent) {
        throw new Error(
          `This venue already has an event from date ${existingEvent.eventDate} time  ${formatTimeHHMM(existingEvent.startTime)} to ${formatTimeHHMM(existingEvent.endTime)}  Please choose a different time.`,
        );
      }

      return await tx.event.create({
        data: {
          title: dto.title,
          type: dto.type,
          description: dto.description,
          eventDate: dto.eventDate,
          startTime,
          endTime,
          performers: dto.performers,
          ticketPrice: dto.ticketPrice,
          maxTickets: dto.maxTickets,
          ticketsSold: 0,
          status: EventStatus.ACTIVE,
          venueName: dto.venueName,
          venueAddress: dto.venueAddress,
          venueCity: dto.venueCity,
          venueState: dto.venueState,
          venueCountry: dto.venueCountry,
          venueTotalCapacity: dto.venueTotalCapacity,

          manager: { connect: { id: ctx.id } },
        },
      });
    });

    return {
      message: 'event create successFully',
      event,
    };
  }

  // async updateEvent(
  //   eventId: number,
  //   // ctx: AuthenticatedUser,
  //   dto: updateEventDto,
  // ) {
  //   const existingEvent = await this.prisma.event.findUnique({
  //     where: { id: eventId },
  //     include: { venue: true },
  //   });
  //   if (!existingEvent) {
  //     throw new NotFoundException('Event not found');
  //   }

  //   let venue = existingEvent.venue;

  //   if (dto.venueId) {
  //     const newVenue = await this.prisma.venue.findUnique({
  //       where: { id: dto.venueId },
  //     });

  //     if (!newVenue) {
  //       throw new NotFoundException('Venue not found');
  //     }
  //     venue = newVenue;
  //   }

  //   let startTime = existingEvent.startTime;
  //   let endTime = existingEvent.endTime;

  //   if (dto.startTime) {
  //     startTime = new Date(dto.startTime);
  //   }

  //   if (dto.endTime) {
  //     endTime = new Date(dto.endTime);
  //   }

  //   const maxTickets = dto.maxTickets ?? existingEvent.maxTickets;

  //   if (maxTickets <= 0) {
  //     throw new BadRequestException('Invalid ticket count');
  //   }

  //   if (maxTickets > venue.totalCapacity) {
  //     throw new BadRequestException('Tickets exceed venue capacity');
  //   }

  //   if (maxTickets < existingEvent.ticketsSold) {
  //     throw new BadRequestException(
  //       'Cannot reduce tickets below already sold count',
  //     );
  //   }

  //   if (dto.startTime || dto.venueId) {
  //     const conflict = await this.prisma.event.findFirst({
  //       where: {
  //         id: { not: eventId },
  //         venueId: dto.venueId ?? existingEvent.venueId,
  //         startTime,
  //       },
  //     });

  //     if (conflict) {
  //       throw new BadRequestException(
  //         'Another event already exists at this venue and time',
  //       );
  //     }
  //   }

  //   const updatedEvent = await this.prisma.event.update({
  //     where: { id: eventId },
  //     data: {
  //       title: dto.title ?? existingEvent.title,
  //       type: dto.type ?? existingEvent.type,
  //       description: dto.description ?? existingEvent.description,
  //       startTime,
  //       endTime,
  //       performers: dto.performers ?? existingEvent.performers,
  //       ticketPrice: dto.ticketPrice ?? existingEvent.ticketPrice,
  //       maxTickets,
  //       venue: dto.venueId ? { connect: { id: dto.venueId } } : undefined,
  //     },
  //     include: {
  //       venue: true,
  //       manager: {
  //         select: {
  //           id: true,
  //           firstname: true,
  //           lastname: true,
  //           email: true,
  //         },
  //       },
  //     },
  //   });

  //   return {
  //     message: 'Event updated successfully',
  //     data: updatedEvent,
  //   };
  // }

  async findEventById(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },

      include: {
        manager: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return {
      success: true,
      message: 'Event fetched successfully',
      data: {
        ...event,
        startTime: formatTimeHHMM(event.startTime),
        endTime: formatTimeHHMM(event.endTime),
      },
    };
  }

  async findAllEvents() {
    const events = await this.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        manager: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!events) {
      throw new Error('event is not found ');
    }

    return {
      success: true,
      message: 'Event fetched successfully',
      data: events.map((event) => ({
        ...event,
        startTime: formatTimeHHMM(event.startTime),
        endTime: formatTimeHHMM(event.endTime),
      })),
    };
  }

  async updateEventStatus(
    ctx: AuthenticatedUser,
    eventId: number,
    dto: UpdateEventStatusDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      // if (ctx.type === UserType.MANAGER) {
      // const allowedStatuses: EventStatus[] = [
      //   EventStatus.ACTIVE,
      //   EventStatus.SUSPENDED,
      // ];
      // if (!allowedStatuses.includes(dto.status)) {
      //   throw new ForbiddenException(
      //     'Manager sirf Active ya Blocked kar sakta hai',
      //   );
      // }

      const updated = await tx.event.update({
        where: { id: eventId },
        data: { status: dto.status },
      });

      return {
        message: `Event ${dto.status} update successfully`,
        event: updated,
      };
    });
  }
}
