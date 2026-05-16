import { Prisma } from 'src/generated/prisma/client';
import { CreateEventDto } from '../dto';
export async function findVenueConflict(
  tx: Prisma.TransactionClient,
  dto: CreateEventDto,
  startTime: Date,
  endTime: Date,
) {
  return tx.event.findFirst({
    where: {
      eventDate: dto.eventDate,
      venueName: dto.venueName,
      venueAddress: dto.venueAddress,
      venueCity: dto.venueCity,
      venueState: dto.venueState,
      venueCountry: dto.venueCountry,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });
}
