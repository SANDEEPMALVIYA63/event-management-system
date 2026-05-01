import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue-request.dto';
import { UpdateVenueDto } from './dto/update-vanue-request.dto';
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
  // AccessGuard,
} from '@Common';
// import { updateEventDto } from 'src/event/dto/update-event-request.dto';
@ApiTags('Venue')
@ApiBearerAuth()
@Controller('venue')
@Roles(UserType.ADMIN, UserType.MANAGER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class VenueController {
  constructor(private venueService: VenueService) {}

  @Post()
  @ApiOperation({ summary: 'Create new venue' })
  // @ApiResponse({ status: 201, description: 'Venue created successfully' })
  // @ApiResponse({ status: 400, description: 'Venue already exists' })
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
  async updateVenue(@Param('id') id: string, @Body() dto: UpdateVenueDto) {
    return this.venueService.updateVenue(id, dto);
  }

  // @Delete(':id')
  // async deleteVenue(@Param('id') id: string) {
  //   return this.venueService.deleteVenue(id);
  // }
}
