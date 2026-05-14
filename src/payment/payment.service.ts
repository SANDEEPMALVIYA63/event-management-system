import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { TransactionType } from '../generated/prisma/client';
@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}
  async creditAdminShare(adminShare: number, bookingId: number) {
    return this.prisma.$transaction(async (tx) => {
      const admin = await tx.admin.findFirst();

      if (!admin) {
        throw new Error('admin not found  ');
      }
      const adminWallet = await tx.adminWallet.findFirst({
        where: {
          adminId: admin.id,
        },
      });
      if (!adminWallet) {
        throw new Error('Admin wallet not found');
      }

      const updatedWallet = await tx.adminWallet.update({
        where: {
          id: adminWallet.id,
        },
        data: {
          balance: {
            increment: adminShare,
          },
        },
      });

      const adminTransection = await tx.adminTransaction.create({
        data: {
          adminWalletId: updatedWallet.id,
          adminId: updatedWallet.adminId,
          creadedAmout: adminShare,
          amount: updatedWallet.balance,
          type: TransactionType.CREDIT,
          bookingId: bookingId,
          description: `Admin share credited`,
        },
      });

      if (!adminTransection) {
        throw new Error('adminTransection is not found');
      }
      return updatedWallet;
    });
  }

  async adminTransections(adminId: number) {
    const transactions = await this.prisma.adminTransaction.findMany({
      where: { adminId },

      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!transactions) {
      throw new Error('admin transection not found ');
    }

    return transactions;
  }
}
