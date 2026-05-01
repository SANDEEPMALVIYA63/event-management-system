import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty()
  @IsInt()
  bookingId: number;
}
