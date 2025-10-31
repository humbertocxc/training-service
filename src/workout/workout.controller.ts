import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import type { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutResponseDto } from './workout-response.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('workouts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  private getUserIdOrThrow(req: Request): string {
    const jwtUserId = req.user?.externalUserId;
    if (!jwtUserId) {
      throw new UnauthorizedException('Missing user authentication');
    }
    return jwtUserId;
  }

  @Post()
  @ApiOperation({
    summary: 'Create workout template',
    description:
      'Creates a new workout template for the authenticated user. A workout must have at least one exercise.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Workout template successfully created.',
    type: WorkoutResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  async create(@Req() req: Request, @Body() dto: CreateWorkoutDto) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.create(userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List workout templates',
    description: 'Returns all workout templates for the authenticated user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user workout templates.',
    type: [WorkoutResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  async list(@Req() req: Request) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workout template by ID',
    description:
      'Returns a single workout template by ID for the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Workout template ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workout template found.',
    type: WorkoutResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workout template not found or does not belong to user.',
  })
  async get(@Req() req: Request, @Param('id') id: string) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.findOneForUser(Number(id), userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete workout template',
    description: 'Deletes a workout template by ID for the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Workout template ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workout template successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workout template not found or does not belong to user.',
  })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.deleteForUser(Number(id), userId);
  }
}
