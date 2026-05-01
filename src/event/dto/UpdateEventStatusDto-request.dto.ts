import { EventStatus } from 'src/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export class UpdateEventStatusDto {
  @ApiProperty({
    enum: EventStatus,
  })
  @IsEnum(EventStatus)
  status: EventStatus;
}
