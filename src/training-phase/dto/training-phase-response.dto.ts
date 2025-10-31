import {
  ApiProperty,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

type TrainingPhaseEntity = {
  id: number;
  externalUserId: string;
  name: string;
  goalId: number | null;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  workouts?: unknown[];
  goal?: unknown;
};

export class TrainingPhaseResponseDto {
  @ApiProperty({ description: 'Phase ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User external ID', example: 'user-123' })
  externalUserId: string;

  @ApiProperty({
    description: 'Phase name',
    example: 'Strength Building Block',
  })
  name: string;

  @ApiProperty({
    description: 'Associated goal ID',
    example: 1,
    nullable: true,
  })
  goalId: number | null;

  @ApiProperty({ description: 'Start date' })
  startDate: Date;

  @ApiProperty({ description: 'End date', nullable: true })
  endDate: Date | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated workouts',
    isArray: true,
  })
  workouts?: unknown[];

  @ApiProperty({
    description: 'Associated goal',
  })
  goal?: unknown;

  static fromEntity(phase: TrainingPhaseEntity): TrainingPhaseResponseDto {
    return {
      id: phase.id,
      externalUserId: phase.externalUserId,
      name: phase.name,
      goalId: phase.goalId,
      startDate: phase.startDate,
      endDate: phase.endDate,
      createdAt: phase.createdAt,
      updatedAt: phase.updatedAt,
      workouts: phase.workouts,
      goal: phase.goal,
    };
  }
}

export const listTrainingPhasesApiOperation = ApiOperation({
  summary: 'Get all training phases for current user',
});

export const listTrainingPhasesApiResponseOk = ApiResponse({
  status: 200,
  description: 'List of training phases',
  type: [TrainingPhaseResponseDto],
});

export const getTrainingPhaseApiOperation = ApiOperation({
  summary: 'Get a specific training phase',
});

export const getTrainingPhaseApiParam = ApiParam({
  name: 'id',
  description: 'Training phase ID',
  type: Number,
});

export const getTrainingPhaseApiResponseOk = ApiResponse({
  status: 200,
  description: 'Training phase details',
  type: TrainingPhaseResponseDto,
});

export const getCurrentTrainingPhasesApiOperation = ApiOperation({
  summary: 'Get currently active training phases',
});

export const getCurrentTrainingPhasesApiResponseOk = ApiResponse({
  status: 200,
  description: 'List of current training phases',
  type: [TrainingPhaseResponseDto],
});
