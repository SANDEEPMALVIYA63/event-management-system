import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaModule } from '../prisma';
import { PaymentModule } from 'src/payment/payment.module';
// import {P}

@Module({
  imports: [PrismaModule, PaymentModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
