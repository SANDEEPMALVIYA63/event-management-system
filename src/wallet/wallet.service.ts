import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    return wallet;
  }

  async getTransactions(userId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        wallet: { userId },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions;
  }
}
