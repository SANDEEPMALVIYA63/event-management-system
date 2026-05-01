import { IsEnum, IsInt } from 'class-validator';
import { UserStatus } from 'src/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';
export class ChangeStatusDto {
  @IsInt()
  @ApiProperty()
  userId: number;

  @ApiProperty({
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
