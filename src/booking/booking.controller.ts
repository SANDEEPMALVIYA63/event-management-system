import { Controller, UseGuards, Post, Req, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { ConfirmBookingDto, CreateBookingDto } from './dto';
import {
  AccessGuard,
  AuthenticatedRequest,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';
@ApiTags('booking')
@ApiBearerAuth()
@Roles(UserType.USER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  getContext(req: AuthenticatedRequest) {
    return req.user;
  }

  @Post()
  createBooking(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBookingDto,
  ) {
    const ctx = this.getContext(req);
    return this.bookingService.createBooking(ctx, dto);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm booking' })
  bookingConfirm(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ConfirmBookingDto,
  ) {
    const ctx = this.getContext(req);
    return this.bookingService.confirmBooking(ctx, dto);
  }
}
