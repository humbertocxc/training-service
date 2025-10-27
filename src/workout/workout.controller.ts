import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import type { CreateWorkoutDto } from './dto/create-workout.dto';
import type { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a workout template for the authenticated user',
  })
  @ApiResponse({ status: 201, description: 'Workout created.' })
  async create(@Req() req: Request, @Body() dto: CreateWorkoutDto) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.workoutService.create(externalUserId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List workouts for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of workouts.' })
  async list(@Req() req: Request) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.workoutService.findByUser(externalUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workout by id for authenticated user' })
  async get(@Req() req: Request, @Param('id') id: string) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.workoutService.findOneForUser(Number(id), externalUserId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout by id for authenticated user' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.workoutService.deleteForUser(Number(id), externalUserId);
  }
}
