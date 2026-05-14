import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BaseController,
  AuthenticatedRequest,
  Roles,
  JwtAuthGuard,
  // AccessGuard,
  RolesGuard,
  UserType,
  AccessGuard,
} from '@Common';
@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserType.ADMIN)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('payment')
export class PaymentController extends BaseController {
  constructor(private readonly paymentService: PaymentService) {
    super();
  }

  @Get('admin-transection')
  async getAdminTransection(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return this.paymentService.adminTransections(ctx.user.id);
  }
}
