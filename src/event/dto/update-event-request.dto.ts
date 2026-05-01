import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
} from 'class-validator';
import { EventType, EventStatus } from 'src/generated/prisma/enums';

export class updateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  venueId?: string;

  @IsOptional()
  @IsString()
  performers?: string;

  @IsOptional()
  ticketPrice?: number;

  @IsOptional()
  @IsInt()
  maxTickets?: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
