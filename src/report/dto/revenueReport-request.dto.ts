// report/dto/report-query.dto.ts

import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportQueryDto {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // eventId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  managerId?: number;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsDateString()
  // startDate?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsDateString()
  // endDate?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // page?: number;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // limit?: number;
}
