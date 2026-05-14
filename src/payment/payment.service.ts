import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { TransactionType, UserType } from '../generated/prisma/client';
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

  async creditManagerShare(managerShare: number, bookingId: number) {
    return this.prisma.$transaction(async (tx) => {
      const Booking = await tx.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          event: {
            include: {
              manager: {
                include: { wallet: true },
              },
            },
          },
          transactions: true,
        },
      });

      if (!Booking) {
        throw new Error('booking are  not found ');
      }

      if (!Booking.event.managerId) {
        throw new Error('managerId is not  found ');
      }

      const manager = await tx.user.findUnique({
        where: { id: Booking.event.managerId },
      });

      if (!manager) {
        throw new Error('manager are  not found');
      }

      if (manager.role !== UserType.MANAGER) {
        throw new Error('you are not manager ');
      }

      const updatedManagerWallet = await tx.wallet.update({
        where: { userId: manager.id },
        data: {
          balance: {
            increment: managerShare,
          },
        },
      });

      if (!updatedManagerWallet) {
        throw new Error('something went wrong when update a manager wallet ');
      }

      const managerTransection = await tx.transaction.create({
        data: {
          walletId: updatedManagerWallet.id,
          userId: manager.id,
          bookingId: bookingId,
          amount: managerShare,
          type: TransactionType.CREDIT,
          description: 'manager  share credited',
        },
      });

      if (!managerTransection) {
        throw new Error(
          'something went wrong when  create a managerTransection',
        );
      }
      return updatedManagerWallet;
    });
  }

  async managerTrasnsection(managerId: number) {
    const managerTransection = await this.prisma.transaction.findMany({
      where: { userId: managerId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!managerTransection) {
      throw new Error('managerTransection not found ');
    }

    return managerTransection;
  }
}
