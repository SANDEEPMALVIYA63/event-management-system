import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserType } from 'src/generated/prisma/enums';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueReport(userId: number, userType: UserType) {
    if (userType === UserType.ADMIN) {
      const admin = await this.prisma.admin.findFirst();
      if (!admin) throw new Error('Admin not found');

      const result = await this.prisma.revenueShare.aggregate({
        _sum: {
          totalAmount: true,
          adminShare: true,
          managerShare: true,
        },
      });

      return {
        role: 'ADMIN',
        totalRevenue: result._sum.totalAmount ?? 0,
        adminEarning: result._sum.adminShare ?? 0,
        managerEarning: result._sum.managerShare ?? 0,
      };
    }

    if (userType === UserType.MANAGER) {
      const manager = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!manager) throw new Error('Manager not found');
      if (manager.role !== UserType.MANAGER) {
        throw new Error('You do not have permission');
      }

      const result = await this.prisma.revenueShare.aggregate({
        where: { managerId: userId },
        _sum: {
          totalAmount: true,
          adminShare: true,
          managerShare: true,
        },
      });

      return {
        role: UserType.MANAGER,
        managerId: manager.id,
        ManagerName: manager.firstname,
        managerEmail: manager.email,
        totalRevenue: result._sum.totalAmount ?? 0,
        adminEarning: result._sum.adminShare ?? 0,
        managerEarning: result._sum.managerShare ?? 0,
      };
    }

    throw new Error('Invalid role');
  }
}
