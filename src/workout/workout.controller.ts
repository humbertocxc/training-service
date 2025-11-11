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
} from '@nestjs/common';
import { WorkoutService } from './services/workout.service';
import type { CreateWorkoutDto } from './dto/create-workout.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  workoutApiTags,
  workoutApiBearerAuth,
  listWorkoutApiOperation,
  listWorkoutApiResponseOk,
  listWorkoutApiResponseUnauthorized,
  listWorkoutApiResponseForbidden,
  getWorkoutApiOperation,
  getWorkoutApiParam,
  getWorkoutApiResponseOk,
  getWorkoutApiResponseUnauthorized,
  getWorkoutApiResponseForbidden,
  getWorkoutApiResponseNotFound,
} from './dto/workout-response.dto';
import {
  createWorkoutApiOperation,
  createWorkoutApiResponseCreated,
  createWorkoutApiResponseBadRequest,
  createWorkoutApiResponseUnauthorized,
  createWorkoutApiResponseForbidden,
} from './dto/create-workout.dto';
import {
  deleteWorkoutApiOperation,
  deleteWorkoutApiParam,
  deleteWorkoutApiResponseOk,
  deleteWorkoutApiResponseUnauthorized,
  deleteWorkoutApiResponseForbidden,
  deleteWorkoutApiResponseNotFound,
} from './dto/delete-workout.dto';

@workoutApiTags
@workoutApiBearerAuth
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
  @createWorkoutApiOperation
  @createWorkoutApiResponseCreated
  @createWorkoutApiResponseBadRequest
  @createWorkoutApiResponseUnauthorized
  @createWorkoutApiResponseForbidden
  async create(@Req() req: Request, @Body() dto: CreateWorkoutDto) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.create(userId, dto);
  }

  @Get()
  @listWorkoutApiOperation
  @listWorkoutApiResponseOk
  @listWorkoutApiResponseUnauthorized
  @listWorkoutApiResponseForbidden
  async list(@Req() req: Request) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.findByUser(userId);
  }

  @Get(':id')
  @getWorkoutApiOperation
  @getWorkoutApiParam
  @getWorkoutApiResponseOk
  @getWorkoutApiResponseUnauthorized
  @getWorkoutApiResponseForbidden
  @getWorkoutApiResponseNotFound
  async get(@Req() req: Request, @Param('id') id: string) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.findOneForUser(Number(id), userId);
  }

  @Delete(':id')
  @deleteWorkoutApiOperation
  @deleteWorkoutApiParam
  @deleteWorkoutApiResponseOk
  @deleteWorkoutApiResponseUnauthorized
  @deleteWorkoutApiResponseForbidden
  @deleteWorkoutApiResponseNotFound
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = this.getUserIdOrThrow(req);
    return this.workoutService.deleteForUser(Number(id), userId);
  }
}
