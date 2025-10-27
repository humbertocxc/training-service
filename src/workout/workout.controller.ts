import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
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
@Controller('users/:userId/workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  private validateUserAccess(
    jwtUserId: string | undefined,
    urlUserId: string,
  ): void {
    if (!jwtUserId) {
      throw new UnauthorizedException('Missing user authentication');
    }
    if (jwtUserId !== urlUserId) {
      throw new ForbiddenException(
        'Access denied: You can only access your own resources',
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create workout template',
    description:
      'Creates a new workout template for the authenticated user. A workout must have at least one exercise.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
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
  async create(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body() dto: CreateWorkoutDto,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.workoutService.create(userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List workout templates',
    description: 'Returns all workout templates for the authenticated user.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
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
  async list(@Req() req: Request, @Param('userId') userId: string) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.workoutService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workout template by ID',
    description:
      'Returns a single workout template by ID for the authenticated user.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
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
  async get(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.workoutService.findOneForUser(Number(id), userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete workout template',
    description: 'Deletes a workout template by ID for the authenticated user.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
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
  async remove(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.workoutService.deleteForUser(Number(id), userId);
  }
}
