import { BaseController, RolesGuard } from '@Common';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
  AccessGuard,
  Roles,
  UserType,
} from '@Common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { UserType } from 'src/generated/prisma/enums';
@ApiTags('User')
@ApiBearerAuth()
@Roles(UserType.USER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('wallet')
export class WalletController extends BaseController {
  constructor(private walletService: WalletService) {
    super();
  }

  @Get('getWallet')
  async getWallet(@Req() req: AuthenticatedRequest) {
    // console.log(" req in wallet controller ", req);

    const ctx = this.getContext(req);
    // console.log('this.getContext(req); ', ctx);
    return this.walletService.getWallet(ctx.user.id);
  }

  @Get('transactions')
  async getTransactions(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    // console.log('this.getContext(req); ', ctx);

    return this.walletService.getTransactions(ctx.user.id);
  }
}
