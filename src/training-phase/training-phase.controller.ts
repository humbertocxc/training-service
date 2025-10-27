import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { TrainingPhaseService } from './training-phase.service';
import { CreateTrainingPhaseDto } from './dto/create-training-phase.dto';
import { UpdateTrainingPhaseDto } from './dto/update-training-phase.dto';
import { TrainingPhaseResponseDto } from './dto/training-phase-response.dto';

@ApiTags('training-phases')
@Controller('training-phase')
export class TrainingPhaseController {
  constructor(private readonly trainingPhaseService: TrainingPhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new training phase' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Training phase created successfully',
    type: TrainingPhaseResponseDto,
  })
  async create(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateTrainingPhaseDto,
  ): Promise<TrainingPhaseResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const phase = await this.trainingPhaseService.create(userId, dto);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Get()
  @ApiOperation({ summary: 'Get all training phases for current user' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of training phases',
    type: [TrainingPhaseResponseDto],
  })
  async findAll(
    @Headers('x-user-id') userId: string,
  ): Promise<TrainingPhaseResponseDto[]> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const phases = await this.trainingPhaseService.findByUser(userId);
    return phases.map((p) => TrainingPhaseResponseDto.fromEntity(p));
  }

  @Get('current')
  @ApiOperation({ summary: 'Get currently active training phases' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of current training phases',
    type: [TrainingPhaseResponseDto],
  })
  async getCurrentPhases(
    @Headers('x-user-id') userId: string,
  ): Promise<TrainingPhaseResponseDto[]> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const phases = await this.trainingPhaseService.getCurrentPhases(userId);
    return phases.map((p) => TrainingPhaseResponseDto.fromEntity(p));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific training phase' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Training phase details',
    type: TrainingPhaseResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
  ): Promise<TrainingPhaseResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const phase = await this.trainingPhaseService.findOneForUser(id, userId);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a training phase' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Training phase updated successfully',
    type: TrainingPhaseResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
    @Body() dto: UpdateTrainingPhaseDto,
  ): Promise<TrainingPhaseResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const phase = await this.trainingPhaseService.update(id, userId, dto);
    return TrainingPhaseResponseDto.fromEntity(phase);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a training phase' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Training phase deleted successfully',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
  ): Promise<{ success: boolean }> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    await this.trainingPhaseService.delete(id, userId);
    return { success: true };
  }
}
