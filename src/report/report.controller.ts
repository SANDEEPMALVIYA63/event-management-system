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

  @Roles(UserType.ADMIN)
  @Get('adminTotalEerning')
  totalEarnings(@Req() req: AuthenticatedRequest) {
    return this.reportService.TotalEarning(req.user.id);
  }

  @Roles(UserType.ADMIN)
  @Get('admin-Wallet')
  async adminWallet(@Req() req: AuthenticatedRequest) {
    return this.reportService.getAdminWallet(req.user.id);
  }

  @Roles(UserType.MANAGER && UserType.ADMIN)
  @Get('ManagerTotalEarning')
  getRevenueReport(@Req() req: AuthenticatedRequest) {
    return this.reportService.getRevenueReport(req.user.id, req.user.type);
  }

  @Roles(UserType.MANAGER)
  @Get('ManagerWallet')
  getManagerWallet(@Req() req: AuthenticatedRequest) {
    return this.reportService.getManagerWallet(req.user.id);
  }
}
