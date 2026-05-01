import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserType } from 'src/generated/prisma/enums';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueReport(managerId: number) {
    // const { managerId } = dto;

    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException('User not found');
    }
    if (manager.role !== UserType.MANAGER && manager.role !== UserType.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
    const result = await this.prisma.revenueShare.aggregate({
      where: { managerId },
      _sum: {
        totalAmount: true,
        adminShare: true,
        managerShare: true,
      },
    });

    return {
      totalRevenue: result._sum.totalAmount ?? 0,
      adminEarning: result._sum.adminShare ?? 0,
      managerEarning: result._sum.managerShare ?? 0,
    };
  }
}
