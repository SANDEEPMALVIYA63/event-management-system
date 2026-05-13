// dto/create-event.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  IsNumber,
  // Matches,
} from 'class-validator';
import { EventType } from 'src/generated/prisma/enums';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty()
  @IsDateString()
  // @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  //   message: 'Invalid time format, use HH:MM',
  // })
  startTime: string;

  @ApiProperty()
  @IsDateString()
  // @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  //   message: 'Invalid time format, use HH:MM',
  // })
  endTime: string;

  @ApiProperty()
  @IsNumber()
  venueId: number;
  @ApiProperty()
  @IsString()
  performers: string;

  @ApiProperty()
  @IsNumber()
  ticketPrice: number;

  @ApiProperty()
  @IsInt()
  maxTickets: number;
}
