import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthenticatedUser, UserType } from '../types';
import { PrismaService } from '../../prisma';
import { AdminStatus, UserStatus } from '../../generated/prisma/client';

export const getAccessGuardCacheKey = (user: { id: number; type: string }) =>
  `${user.type}-${user.id}-access`.toLowerCase();

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;
    if (!user) return false;

    return await this.validate(user);
  }
  async validate(user: AuthenticatedUser) {
    const cacheKey = getAccessGuardCacheKey(user);
    const cacheTtl = 300000;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached === true) return true;
    if (cached === false) throw new UnauthorizedException();

    if (user.type === UserType.USER) {
      const userInfo = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
      if (userInfo?.status !== UserStatus.ACTIVE) {
        await this.cacheManager.set(cacheKey, false, cacheTtl);
        throw new UnauthorizedException();
      }
    } else if (user.type === UserType.ADMIN) {
      const userInfo = await this.prisma.admin.findUnique({
        where: { id: user.id },
      });

      if (userInfo?.status !== AdminStatus.ACTIVE) {
        await this.cacheManager.set(cacheKey, false, cacheTtl);
        throw new UnauthorizedException();
      }
    } else if (user.type === UserType.MANAGER) {
      const userInfo = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (userInfo?.status !== UserStatus.ACTIVE) {
        await this.cacheManager.set(cacheKey, false, cacheTtl);

        throw new UnauthorizedException();
      }
    }

    await this.cacheManager.set(cacheKey, true, cacheTtl);
    return true;
  }
}
