import { join } from 'node:path';
import { Cache } from 'cache-manager';
import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { adminConfigFactory } from '@Config';
import {
  StorageService,
  UtilsService,
  ValidatedUser,
  UserType,
  getAccessGuardCacheKey,
} from '@Common';
import { PrismaService } from '../prisma';
import {
  Admin,
  AdminMeta,
  Prisma,
  User,
  UserStatus,
} from '../generated/prisma/client';
import {
  AdminStatus,
  // BookingStatus,
  RevenueStatus,
} from '../generated/prisma/enums';
import { UpdateUserStatusDto } from './dto/UpdateUserStatusDto-request.dto';
@Injectable()
export class AdminService {
  constructor(
    @Inject(adminConfigFactory.KEY)
    private readonly config: ConfigType<typeof adminConfigFactory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly storageService: StorageService,
  ) {}

  private getProfileImageUrl(profileImage: string): string {
    return this.storageService.getFileUrl(
      profileImage,
      this.config.profileImagePath,
    );
  }

  private hashPassword(password: string): { salt: string; hash: string } {
    const salt = this.utilsService.generateSalt(this.config.passwordSaltLength);
    const hash = this.utilsService.hashPassword(
      password,
      salt,
      this.config.passwordHashLength,
    );
    return { salt, hash };
  }

  async isEmailExist(email: string, excludeAdminId?: number): Promise<boolean> {
    return (
      (await this.prisma.admin.count({
        where: {
          email: email.toLowerCase(),
          NOT: {
            id: excludeAdminId,
          },
        },
      })) !== 0
    );
  }

  async getById(adminId: number): Promise<Admin> {
    return await this.prisma.admin.findUniqueOrThrow({
      where: {
        id: adminId,
      },
    });
  }

  async getByEmail(email: string): Promise<Admin | null> {
    return await this.prisma.admin.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async getMetaById(adminId: number): Promise<AdminMeta> {
    return await this.prisma.adminMeta.findUniqueOrThrow({
      where: {
        adminId,
      },
    });
  }

  async authenticate(adminId: number, password: string): Promise<Admin> {
    const admin = await this.getById(adminId);
    const validation = await this.validateCredentials(admin.email, password);

    if (!validation === null) throw new Error('Admin not found');
    if (validation === false) throw new Error('Incorrect password');

    return admin;
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<ValidatedUser | false | null> {
    const admin = await this.getByEmail(email);
    if (!admin) return null;
    if (admin.status !== AdminStatus.Active) {
      throw new Error(
        'Your account has been temporarily suspended/blocked by the system',
      );
    }

    const adminMeta = await this.getMetaById(admin.id);
    const passwordHash = this.utilsService.hashPassword(
      password,
      adminMeta.passwordSalt || '',
      adminMeta.passwordHash
        ? adminMeta.passwordHash.length / 2
        : this.config.passwordHashLength,
    );

    if (adminMeta.passwordHash === passwordHash) {
      return {
        id: admin.id,
        type: UserType.ADMIN,
      };
    }

    return false;
  }

  async getProfile(adminId: number): Promise<Admin> {
    const admin = await this.getById(adminId);
    if (admin.profileImage) {
      admin.profileImage = this.getProfileImageUrl(admin.profileImage);
    }
    return admin;
  }

  async updateProfileDetails(
    adminId: number,
    data: {
      firstname?: string;
      lastname?: string;
      email?: string;
    },
    options?: { tx?: Prisma.TransactionClient },
  ): Promise<Admin> {
    const prismaClient = options?.tx ? options.tx : this.prisma;

    const admin = await prismaClient.admin.findUniqueOrThrow({
      where: { id: adminId },
    });
    if (data.email && (await this.isEmailExist(data.email, adminId))) {
      throw new Error('Email already exist');
    }

    return await prismaClient.admin.update({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email && data.email.toLowerCase(),
      },
      where: {
        id: admin.id,
      },
    });
  }

  async updateProfileImage(
    adminId: number,
    profileImage: string,
  ): Promise<{ profileImage: string | null }> {
    const admin = await this.getById(adminId);

    return await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id: adminId },
        data: { profileImage },
      });

      // Remove previous profile image from storage
      if (admin.profileImage) {
        await this.storageService.removeFile(
          join(this.config.profileImagePath, admin.profileImage),
        );
      }
      await this.storageService.move(
        profileImage,
        this.config.profileImagePath,
      );

      return {
        profileImage: this.getProfileImageUrl(profileImage),
      };
    });
  }

  async changePassword(
    adminId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<Admin> {
    const admin = await this.getById(adminId);
    const adminMeta = await this.getMetaById(admin.id);

    const hashedPassword = this.utilsService.hashPassword(
      oldPassword,
      adminMeta.passwordSalt || '',
      adminMeta.passwordHash
        ? adminMeta.passwordHash.length / 2
        : this.config.passwordHashLength,
    );

    if (hashedPassword !== adminMeta.passwordHash)
      throw new Error('Password does not match');

    const { salt, hash } = this.hashPassword(newPassword);
    const passwordSalt = salt;
    const passwordHash = hash;

    await this.prisma.adminMeta.update({
      data: {
        passwordHash,
        passwordSalt,
      },
      where: {
        adminId,
      },
    });
    return admin;
  }

  async setStatus(userId: number, status: AdminStatus): Promise<Admin> {
    await this.cacheManager.del(
      getAccessGuardCacheKey({ id: userId, type: UserType.ADMIN }),
    );
    return await this.prisma.admin.update({
      data: { status },
      where: {
        id: userId,
      },
    });
  }

  async setRole(
    adminId: number,
    userId: number,
    role: UserType,
  ): Promise<User> {
    if (adminId === userId) {
      throw new ForbiddenException('Admin cannot change their own role');
    }

    await this.cacheManager.del(
      getAccessGuardCacheKey({ id: userId, type: UserType.USER }),
    );

    return await this.prisma.user.update({
      data: { role },
      where: { id: userId },
    });
  }

  async setUserStatus(userId: number, status: UserStatus): Promise<User> {
    await this.cacheManager.del(
      getAccessGuardCacheKey({ id: userId, type: UserType.USER }),
    );
    return await this.prisma.user.update({
      data: { status },
      where: {
        id: userId,
      },
    });
  }
  // async updateUserStatus(UserId: number, dto: UpdateUserStatusDto) {
  //   return this.prisma.$transaction(async (tx) => {
  //     const user = await tx.user.findUnique({
  //       where: {
  //         id: UserId,
  //       },
  //     });
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     if (user.role === UserType.ADMIN) {
  //       throw new BadRequestException('Admin ko suspend nahi kar sakte');
  //     }

  //     const updated = await tx.user.update({
  //       where: { id: UserId },
  //       data: {
  //         status: dto.status,
  //       },
  //     });

  //     return {
  //       message: `User ${dto.status === UserStatus.Active ? 'activate' : 'Blocked'} kar diya gaya`,
  //       user: updated,
  //     };
  //   });
  // }

  async TotalEarning(adminId: number) {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });
    if (!admin) {
      throw new NotFoundException('admin not found ');
    }

    const result = await this.prisma.revenueShare.aggregate({
      where: {
        status: RevenueStatus.SETTLED,
      },

      _sum: {
        adminShare: true,
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const eventBreakdown = await this.prisma.revenueShare.groupBy({
      by: ['eventId'],
      where: {
        status: RevenueStatus.SETTLED,
      },
      _sum: {
        adminShare: true,
        managerShare: true,
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const eventIds = eventBreakdown.map((e) => e.eventId);
    const events = await this.prisma.event.findMany({
      where: { id: { in: eventIds } },
      select: { id: true, title: true },
    });

    const breakdown = eventBreakdown.map((item) => ({
      eventId: item.eventId,
      eventTitle: events.find((e) => e.id === item.eventId)?.title ?? 'Unknown',
      totalAmount: item._sum.totalAmount ?? 0,
      adminShare: item._sum.adminShare ?? 0,
      managerShare: item._sum.managerShare ?? 0,
      totalBookings: item._count.id ?? 0,
    }));

    return {
      AdmintotalEarnings: result._sum.adminShare ?? 0,
      PlatformTotalRevenue: result._sum.totalAmount ?? 0,
      totalBookings: result._count.id ?? 0,
      breakdown,
    };
  }
}
