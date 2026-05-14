import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserType } from 'src/generated/prisma/enums';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueReport(managerId: number, type: string) {
    if (type === UserType.ADMIN) {
      const result = await this.prisma.revenueShare.aggregate({
        _sum: {
          totalAmount: true,
          adminShare: true,
          managerShare: true,
        },
      });

      return {
        role: UserType.ADMIN,
        totalRevenue: result._sum.totalAmount ?? 0,
        myEarning: result._sum.adminShare ?? 0,
        managerEarning: result._sum.managerShare ?? 0,
      };
    }

    if (type === UserType.MANAGER) {
      const manager = await this.prisma.user.findUnique({
        where: { id: managerId },
      });

      if (!manager) throw new Error('Manager not found');

      const result = await this.prisma.revenueShare.aggregate({
        where: { managerId: managerId },
        _sum: {
          totalAmount: true,
          adminShare: true,
          managerShare: true,
        },
      });

      return {
        role: UserType.MANAGER,
        managerId: manager.id,
        managerName: manager.firstname,
        managerEmail: manager.email,
        totalRevenue: result._sum.totalAmount ?? 0,
        myEarning: result._sum.managerShare ?? 0,
        adminEarning: result._sum.adminShare ?? 0,
      };
    }

    throw new Error('Invalid role');

    // const manager = await this.prisma.user.findUnique({
    //   where: { id: managerId },
    // });

    // if (!manager) {
    //   throw new Error('Manager not found');
    // }
    // if (manager.role !== UserType.MANAGER) {
    //   throw new Error('You do not have permission to perform this action');
    // }
    // const result = await this.prisma.revenueShare.aggregate({
    //   where: { managerId: managerId },
    //   _sum: {
    //     totalAmount: true,
    //     adminShare: true,
    //     managerShare: true,
    //   },
    // });
    // console.log('result', result);

    // return {
    //   totalRevenue: result._sum.totalAmount ?? 0,
    //   adminEarning: result._sum.adminShare ?? 0,
    //   managerEarning: result._sum.managerShare ?? 0,
    // };
  }

  async getManagerWallet(ManagerId: number) {
    const manager = await this.prisma.user.findUnique({
      where: { id: ManagerId },
    });

    if (!manager) {
      throw new Error('manager not found ');
    }

    if (manager.role !== UserType.MANAGER) {
      throw new Error('you are  not manager ');
    }
    const managerWallet = await this.prisma.wallet.findUnique({
      where: {
        userId: ManagerId,
      },
    });

    if (!managerWallet) {
      throw new Error('manager Wallet Not found ');
    }

    return managerWallet;
  }
}
