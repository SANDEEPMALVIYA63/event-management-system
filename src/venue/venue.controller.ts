import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto, UpdateVenueDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  UserType,
  AccessGuard,
} from '@Common';
@ApiTags('Venue')
@ApiBearerAuth()
@Controller('venue')
@Roles(UserType.ADMIN, UserType.MANAGER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
export class VenueController {
  constructor(private venueService: VenueService) {}

  @Post()
  @ApiOperation({ summary: 'Create new venue' })
  async createVenue(@Body() dto: CreateVenueDto) {
    return this.venueService.createVenue(dto);
  }

  @Get('getAll')
  @ApiResponse({ status: 200, description: 'List of venues' })
  async getAllVenues() {
    return this.venueService.getAllVenues();
  }

  @Patch('update/:id')
  @ApiParam({ name: 'id' })
  async updateVenue(@Param('id') id: number, @Body() dto: UpdateVenueDto) {
    return this.venueService.updateVenue(id, dto);
  }

  // @Delete(':id')
  // async deleteVenue(@Param('id') id: string) {
  //   return this.venueService.deleteVenue(id);
  // }
}
