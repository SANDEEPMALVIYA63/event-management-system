import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ConfirmBookingDto {
  @ApiProperty()
  @IsInt()
  bookingId: number;
}
