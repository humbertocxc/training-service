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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrainingPhaseService } from './training-phase.service';
import { CreateTrainingPhaseDto } from './dto/create-training-phase.dto';
import { UpdateTrainingPhaseDto } from './dto/update-training-phase.dto';
import { TrainingPhaseResponseDto } from './dto/training-phase-response.dto';
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
  @ApiOperation({ summary: 'Create a new training phase' })
  @ApiResponse({
    status: 201,
    description: 'Training phase created successfully',
    type: TrainingPhaseResponseDto,
  })
  async create(
    @Req() req: Request,
    @Body() dto: CreateTrainingPhaseDto,
  ): Promise<TrainingPhaseResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const phase = await this.trainingPhaseService.create(userId, dto);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Get()
  @ApiOperation({ summary: 'Get all training phases for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of training phases',
    type: [TrainingPhaseResponseDto],
  })
  async findAll(@Req() req: Request): Promise<TrainingPhaseResponseDto[]> {
    const userId = this.getUserIdOrThrow(req);
    const phases = await this.trainingPhaseService.findByUser(userId);
    return phases.map((p) => TrainingPhaseResponseDto.fromEntity(p));
  }

  @Get('current')
  @ApiOperation({ summary: 'Get currently active training phases' })
  @ApiResponse({
    status: 200,
    description: 'List of current training phases',
    type: [TrainingPhaseResponseDto],
  })
  async getCurrentPhases(
    @Req() req: Request,
  ): Promise<TrainingPhaseResponseDto[]> {
    const userId = this.getUserIdOrThrow(req);
    const phases = await this.trainingPhaseService.getCurrentPhases(userId);
    return phases.map((p) => TrainingPhaseResponseDto.fromEntity(p));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific training phase' })
  @ApiResponse({
    status: 200,
    description: 'Training phase details',
    type: TrainingPhaseResponseDto,
  })
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrainingPhaseResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const phase = await this.trainingPhaseService.findOneForUser(id, userId);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a training phase' })
  @ApiResponse({
    status: 200,
    description: 'Training phase updated successfully',
    type: TrainingPhaseResponseDto,
  })
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
  @ApiOperation({ summary: 'Delete a training phase' })
  @ApiResponse({
    status: 200,
    description: 'Training phase deleted successfully',
  })
  async delete(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    const userId = this.getUserIdOrThrow(req);
    await this.trainingPhaseService.delete(id, userId);
    return { success: true };
  }
}
