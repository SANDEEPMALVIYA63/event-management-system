// dto/create-venue.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({ example: 'Delhi Stadium' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sector 18, Noida' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Noida' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'UP', required: false })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({ example: 'IN', default: 'IN' })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({ example: 5000 })
  @IsInt()
  totalCapacity: number;
}
