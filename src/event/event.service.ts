import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateEventDto } from './dto/create-event-request.dto';
import { EventStatus } from 'src/generated/prisma/enums';
import { AuthenticatedUser, UserType } from '@Common';
import { UpdateEventStatusDto } from './dto/UpdateEventStatusDto-request.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(ctx: AuthenticatedUser, dto: CreateEventDto) {
    const startTime = new Date(`${dto.eventDate}T${dto.startTime}:00.000Z`);
    const endTime = new Date(`${dto.eventDate}T${dto.endTime}:00.000Z`);

    console.log(`startTime ${startTime} endTime${endTime} `);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error('Invalid date or time format');
    }

    if (startTime >= endTime) {
      throw new Error('endTime must be after startTime');
    }

    if (dto.maxTickets > dto.venueTotalCapacity) {
      throw new Error(
        `maxTickets (${dto.maxTickets}) cannot exceed venueTotalCapacity (${dto.venueTotalCapacity})`,
      );
    }

    if (ctx.type !== UserType.ADMIN && ctx.type !== UserType.MANAGER) {
      throw new Error('only admin and manager allow ');
    }
    const event = await this.prisma.event.create({
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
    return event;
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
        // bookings: {
        //   select: {
        //     id: true,
        //     quantity: true,
        //     totalAmount: true,
        //   },
        // },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return {
      success: true,
      message: 'Event fetched successfully',
      data: event,
    };
  }

  async findAllEvents() {
    const event = this.prisma.event.findMany({
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

    if (!event) {
      throw new Error('event is not found ');
    }

    return event;
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
