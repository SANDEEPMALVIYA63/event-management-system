import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  UserType,
  AuthenticatedRequest,
  AccessGuard,
} from '@Common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@ApiBearerAuth()
@Roles(UserType.ADMIN, UserType.MANAGER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('ManagerTotalEarning')
  getRevenueReport(
    @Req() req: AuthenticatedRequest,
    // @Query() dto: ReportQueryDto,
  ) {
    return this.reportService.getRevenueReport(req.user.id, req.user.type);
  }

  @Roles(UserType.MANAGER)
  @Get('ManagerWallet')
  getManagerWallet(@Req() req: AuthenticatedRequest) {
    return this.reportService.getManagerWallet(req.user.id);
  }
}
