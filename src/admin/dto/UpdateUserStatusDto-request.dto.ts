import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
