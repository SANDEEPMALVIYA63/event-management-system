import { IsEnum, IsInt } from 'class-validator';
import { UserType } from '@Common';
import { ApiProperty } from '@nestjs/swagger';
export class ChangeRoleDto {
  @IsInt()
  @ApiProperty()
  userId: number;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  role: UserType;
}
