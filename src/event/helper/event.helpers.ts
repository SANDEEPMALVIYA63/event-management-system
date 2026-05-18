// import { CreateEventDto } from '../dto';

// export interface NormalisedVenue {
//   venueName: string;
//   venueAddress: string;
//   venueCity: string;
//   venueState: string;
//   venueCountry: string;
// }
export function buildEventDateTimes(
  eventDate: string,
  startTimeStr: string,
  endTimeStr: string,
) {
  const startTime = new Date(`${eventDate}T${startTimeStr}:00.000`);
  const endTime = new Date(`${eventDate}T${endTimeStr}:00.000`);

  if (isNaN(startTime.getTime())) {
    throw new Error(
      `Invalid eventDate or startTime: "${eventDate} ${startTimeStr}"`,
    );
  }
  if (isNaN(endTime.getTime())) {
    throw new Error(
      `Invalid eventDate or endTime: "${eventDate} ${endTimeStr}"`,
    );
  }

  return { startTime, endTime };
}

// export function normaliseVenue(dto: CreateEventDto): NormalisedVenue {
//   return {
//     venueName: dto.venueName.trim(),
//     venueAddress: dto.venueAddress.trim(),
//     venueCity: dto.venueCity.trim(),
//     venueState: dto.venueState.trim(),
//     venueCountry: (dto.venueCountry ?? 'IN').toUpperCase().trim(),
//   };
// }
