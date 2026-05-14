import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserType } from 'src/generated/prisma/enums';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueReport(managerId: number) {
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new Error('Manager not found');
    }
    if (manager.role !== UserType.MANAGER && manager.role !== UserType.ADMIN) {
      throw new Error('You do not have permission to perform this action');
    }
    const result = await this.prisma.revenueShare.aggregate({
      where: { managerId: managerId },
      _sum: {
        totalAmount: true,
        adminShare: true,
        managerShare: true,
      },
    });
    console.log('result', result);

    return {
      totalRevenue: result._sum.totalAmount ?? 0,
      adminEarning: result._sum.adminShare ?? 0,
      managerEarning: result._sum.managerShare ?? 0,
    };
  }
}
