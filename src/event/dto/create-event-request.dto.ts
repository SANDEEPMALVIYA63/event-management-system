// dto/create-event.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  IsNumber,
  Min,
  Matches,
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

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty({ example: '19:30', description: 'Format: HH:MM' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format (e.g. 19:30)',
  })
  startTime: string;

  @ApiProperty({ example: '21:30', description: 'Format: HH:MM' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format (e.g. 21:30)',
  })
  endTime: string;

  @ApiProperty()
  @IsString()
  performers: string;

  @ApiProperty()
  @IsNumber()
  ticketPrice: number;

  @ApiProperty()
  @IsInt()
  maxTickets: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  venueName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  venueAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  venueCity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  venueState: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  venueCountry: string = 'IN';

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  venueTotalCapacity: number;
}
