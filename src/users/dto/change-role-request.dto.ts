// dto/change-role.dto.ts
import { IsEnum, IsInt } from 'class-validator';
import { UserType } from '@Common';

export class ChangeRoleDto {
  @IsInt()
  userId: number;

  @IsEnum(UserType)
  role: UserType;
}
