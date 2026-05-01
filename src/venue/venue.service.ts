import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateVenueDto } from './dto/create-venue-request.dto';
import { UpdateVenueDto } from './dto/update-vanue-request.dto';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  async createVenue(data: CreateVenueDto) {
    const exist = await this.prisma.venue.findFirst({
      where: {
        name: data.name,
        city: data.city,
      },
    });

    if (exist) {
      throw new BadRequestException('Venue already exists in this city');
    }

    const venue = this.prisma.venue.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || 'IN',
        totalCapacity: data.totalCapacity,
      },
    });

    return venue;
  }

  async updateVenue(id: string, data: UpdateVenueDto) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
    });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (data.name && data.city) {
      const exist = await this.prisma.venue.findFirst({
        where: {
          name: data.name,
          city: data.city,
          NOT: { id },
        },
      });

      if (exist) {
        throw new BadRequestException(
          'Venue with same name already exists in this city',
        );
      }
    }

    return this.prisma.venue.update({
      where: { id },
      data: {
        name: data.name,
        city: data.city,
        address: data.address,
        state: data.state,
        country: data.country,
        totalCapacity: data.totalCapacity,
      },
    });
  }

  async getAllVenues() {
    return this.prisma.venue.findMany({});
  }

  // async deleteVenue(id: string) {
  //   const venue = await this.prisma.venue.findUnique({
  //     where: { id },
  //   });
  //   if (!venue) {
  //     throw new NotFoundException('Venue not found');
  //   }
  //   const eventExists = await this.prisma.event.findFirst({
  //     where: { venueId: id },
  //   });

  //   if (eventExists) {
  //     throw new BadRequestException(
  //       'Cannot delete venue. Events are linked to this venue.',
  //     );
  //   }
  //   await this.prisma.venue.delete({
  //     where: { id },
  //   });

  //   return 'venue delete success fully ';
  // }
}
