import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TrainingPhaseService } from './training-phase.service';
import {
  CreateTrainingPhaseDto,
  createTrainingPhaseApiOperation,
  createTrainingPhaseApiResponseOk,
} from './dto/create-training-phase.dto';
import {
  UpdateTrainingPhaseDto,
  updateTrainingPhaseApiOperation,
  updateTrainingPhaseApiParam,
  updateTrainingPhaseApiResponseOk,
} from './dto/update-training-phase.dto';
import {
  TrainingPhaseResponseDto,
  listTrainingPhasesApiOperation,
  listTrainingPhasesApiResponseOk,
  getTrainingPhaseApiOperation,
  getTrainingPhaseApiParam,
  getTrainingPhaseApiResponseOk,
  getCurrentTrainingPhasesApiOperation,
  getCurrentTrainingPhasesApiResponseOk,
} from './dto/training-phase-response.dto';
import {
  deleteTrainingPhaseApiOperation,
  deleteTrainingPhaseApiParam,
  deleteTrainingPhaseApiResponseOk,
} from './dto/delete-training-phase.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('training-phases')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('training-phases')
export class TrainingPhaseController {
  constructor(private readonly trainingPhaseService: TrainingPhaseService) {}

  private getUserIdOrThrow(req: Request): string {
    const jwtUserId = req.user?.externalUserId;
    if (!jwtUserId) {
      throw new UnauthorizedException('Missing user authentication');
    }
    return jwtUserId;
  }

  @Post()
  @createTrainingPhaseApiOperation
  @createTrainingPhaseApiResponseOk
  async create(
    @Req() req: Request,
    @Body() dto: CreateTrainingPhaseDto,
  ): Promise<TrainingPhaseResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const phase = await this.trainingPhaseService.create(userId, dto);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Get()
  @listTrainingPhasesApiOperation
  @listTrainingPhasesApiResponseOk
  async findAll(@Req() req: Request): Promise<TrainingPhaseResponseDto[]> {
    const userId = this.getUserIdOrThrow(req);
    const phases = await this.trainingPhaseService.findByUser(userId);
    return phases.map((p) => TrainingPhaseResponseDto.fromEntity(p));
  }

  @Get('current')
  @getCurrentTrainingPhasesApiOperation
  @getCurrentTrainingPhasesApiResponseOk
  async getCurrentPhases(
    @Req() req: Request,
  ): Promise<TrainingPhaseResponseDto[]> {
    const userId = this.getUserIdOrThrow(req);
    const phases = await this.trainingPhaseService.getCurrentPhases(userId);
    return phases.map((p) => TrainingPhaseResponseDto.fromEntity(p));
  }

  @Get(':id')
  @getTrainingPhaseApiOperation
  @getTrainingPhaseApiParam
  @getTrainingPhaseApiResponseOk
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrainingPhaseResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const phase = await this.trainingPhaseService.findOneForUser(id, userId);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Put(':id')
  @updateTrainingPhaseApiOperation
  @updateTrainingPhaseApiParam
  @updateTrainingPhaseApiResponseOk
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrainingPhaseDto,
  ): Promise<TrainingPhaseResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const phase = await this.trainingPhaseService.update(id, userId, dto);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Delete(':id')
  @deleteTrainingPhaseApiOperation
  @deleteTrainingPhaseApiParam
  @deleteTrainingPhaseApiResponseOk
  async delete(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    const userId = this.getUserIdOrThrow(req);
    await this.trainingPhaseService.delete(id, userId);
    return { success: true };
  }
}
