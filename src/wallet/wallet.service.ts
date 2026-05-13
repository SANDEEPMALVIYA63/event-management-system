import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
    if (!wallet) {
      throw new NotFoundException('wallet is not found ');
    }
    return {
      wallet,
      user: wallet.user.role,
    };
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
    if (!transactions) {
      throw new NotFoundException('transaction is not found ');
    }

    return transactions;
  }
}
