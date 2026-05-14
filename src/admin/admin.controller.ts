import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  ParseEnumPipe,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { UserStatus } from '../generated/prisma/client';
import {
  AccessGuard,
  AuthenticatedRequest,
  BaseController,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';
import { AdminService } from './admin.service';
import {
  AuthenticateRequestDto,
  ChangePasswordRequestDto,
  UpdateProfileDetailsRequestDto,
  UpdateProfileImageRequestDto,
  ChangeRoleDto,
} from './dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserType.ADMIN)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('admin')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    console.log('ctx ini admin controller ', ctx);
    return await this.adminService.getProfile(ctx.user.id);
  }

  @Patch()
  async updateProfileDetails(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileDetailsRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.updateProfileDetails(ctx.user.id, {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
    });
    return { status: 'success' };
  }

  @Post('profile-image')
  updateProfileImage(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileImageRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.adminService.updateProfileImage(ctx.user.id, data.profileImage);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() data: ChangePasswordRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.changePassword(
      ctx.user.id,
      data.oldPassword,
      data.newPassword,
    );
    return { status: 'success' };
  }

  @Post('authenticate')
  async authenticate(
    @Req() req: AuthenticatedRequest,
    @Body() data: AuthenticateRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.authenticate(ctx.user.id, data.password);
    return { status: 'success' };
  }

  @Patch('change-role')
  @Roles(UserType.ADMIN)
  @ApiParam({ name: 'role', enum: UserType })
  async changeRole(
    @Req() req: Request & { user: { id: number; role: UserType } },
    @Body() dto: ChangeRoleDto,
  ) {
    console.log('ChangeRoleDto', ChangeRoleDto);
    return this.adminService.setRole(req.user.id, dto.userId, dto.role);
  }

  @ApiParam({ name: 'status', enum: UserStatus })
  @Roles(UserType.ADMIN)
  @Post(':userId/:status')
  async setUserStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('status', new ParseEnumPipe(UserStatus)) status: UserStatus,
  ) {
    return await this.adminService.setUserStatus(userId, status);
  }
}
