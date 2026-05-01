import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  UserType,
  AuthenticatedRequest,
} from '@Common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@ApiBearerAuth()
@Roles(UserType.ADMIN, UserType.MANAGER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('ManagerTotalEarning')
  @Roles(UserType.ADMIN, UserType.MANAGER)
  getRevenueReport(
    @Req() req: AuthenticatedRequest,
    // @Query() dto: ReportQueryDto,
  ) {
    return this.reportService.getRevenueReport(req.user.id);
  }
}
