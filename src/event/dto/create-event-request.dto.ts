// dto/create-event.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { EventType, EventStatus } from 'src/generated/prisma/enums';

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
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty()
  @IsString()
  venueId: string;
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
