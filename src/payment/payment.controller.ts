import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BaseController,
  AuthenticatedRequest,
  Roles,
  JwtAuthGuard,
  RolesGuard,
  UserType,
  AccessGuard,
} from '@Common';
@ApiTags('Report')
@ApiBearerAuth()
@Roles(UserType.ADMIN, UserType.MANAGER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('payment')
export class PaymentController extends BaseController {
  constructor(private readonly paymentService: PaymentService) {
    super();
  }
  @Roles(UserType.ADMIN)
  @Get('admin-transection')
  async getAdminTransection(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return this.paymentService.adminTransections(ctx.user.id);
  }
  @Roles(UserType.MANAGER)
  @Get('Manager-transection')
  async managerTrasnsection(@Req() req: AuthenticatedRequest) {
    return this.paymentService.managerTrasnsection(req.user.id);
  }
}
