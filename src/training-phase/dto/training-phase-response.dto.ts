import { ApiProperty } from '@nestjs/swagger';

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
