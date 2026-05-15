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
  Length,
} from 'class-validator';
import { EventType } from 'src/generated/prisma/enums';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title!: string;

  @ApiProperty({ enum: EventType })
  @IsNotEmpty()
  @IsEnum(EventType)
  type!: EventType;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 200)
  description?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  eventDate!: string;

  @ApiProperty({ example: '19:30', description: 'Format: HH:MM' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format (e.g. 19:30)',
  })
  startTime!: string;

  @ApiProperty({ example: '21:30', description: 'Format: HH:MM' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format (e.g. 21:30)',
  })
  endTime!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  performers!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ticketPrice!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  maxTickets!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  venueAddress!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueCity!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueState!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueCountry: string = 'IN';

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  venueTotalCapacity!: number;
}
