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
  IsOptional,
  Length,
} from 'class-validator';
import { EventType } from 'src/generated/prisma/enums';

export class CreateEventDto {
  @ApiProperty({ example: 'Coldplay Live in Mumbai', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title!: string;

  @ApiProperty({ enum: EventType })
  @IsNotEmpty()
  @IsEnum(EventType)
  type!: EventType;

  @ApiProperty({ example: ' this is comedy show ', maxLength: 500 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  description?: string;

  @ApiProperty({
    example: '2025-12-25',
    description: 'ISO date string YYYY-MM-DD',
  })
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

  @ApiProperty({ example: 'Abhishek Upmanue ' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  performers!: string;

  @ApiProperty({ example: 999.99, description: 'Ticket price in INR' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  ticketPrice!: number;

  @ApiProperty({ example: 5000, description: 'Max tickets available for sale' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  maxTickets!: number;

  @ApiProperty({ example: 'Indore Stadium ' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueName!: string;

  @ApiProperty({ example: '  new palacia  indore ' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  venueAddress!: string;

  @ApiProperty({ example: 'indore' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueCity!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 60)
  venueState!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  venueCountry: string = 'IN';

  @ApiProperty({
    example: 10000,
    description: 'Total physical capacity of the venue',
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  venueTotalCapacity!: number;
}
