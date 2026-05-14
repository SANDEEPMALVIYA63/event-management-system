import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventStatusDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  AccessGuard,
  AuthenticatedRequest,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';

@ApiTags('event')
@ApiBearerAuth()
@Roles(UserType.ADMIN, UserType.MANAGER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}
  getContext(req: AuthenticatedRequest) {
    return req.user;
  }
  @Post()
  @ApiOperation({ summary: 'Create event' })
  createEvent(@Req() req: AuthenticatedRequest, @Body() dto: CreateEventDto) {
    const ctx = this.getContext(req);
    return this.eventService.createEvent(ctx, dto);
  }

  @Roles(UserType.ADMIN, UserType.MANAGER, UserType.USER)
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAllEvents() {
    return this.eventService.findAllEvents();
  }

  // @Patch(':id')
  // @Roles(UserType.ADMIN, UserType.MANAGER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiOperation({ summary: 'update events' })
  // async updateEvent(
  //   @Param('id') id: number,
  //   @Req() req: AuthenticatedRequest,
  //   @Body() dto: updateEventDto,
  // ) {
  //   return this.eventService.updateEvent(id, dto);
  // }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.MANAGER, UserType.USER)
  getEventById(@Param('id') id: number) {
    return this.eventService.findEventById(id);
  }

  @Patch(':id/status')
  @Roles(UserType.ADMIN, UserType.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'update events status ' })
  async updateEventStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) eventId: number,
    @Body() dto: UpdateEventStatusDto,
  ) {
    const ctx = this.getContext(req);
    return this.eventService.updateEventStatus(ctx, eventId, dto);
  }
}
