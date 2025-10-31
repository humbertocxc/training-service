import {
  ApiProperty,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { Goal } from '@prisma/client';

export class GoalResponseDto {
  @ApiProperty({ description: 'Goal ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User external ID', example: 'user-123' })
  externalUserId: string;

  @ApiProperty({ description: 'Goal name', example: 'Achieve 20 pull-ups' })
  name: string;

  @ApiProperty({
    description: 'Goal type',
    enum: ['reps', 'load', 'time', 'skill'],
    example: 'reps',
  })
  type: string;

  @ApiProperty({ description: 'Target value', example: 20 })
  targetValue: number;

  @ApiProperty({ description: 'Current value', example: 10 })
  currentValue: number;

  @ApiProperty({ description: 'Progress percentage (0-100)', example: 50 })
  progress: number;

  @ApiProperty({
    description: 'Goal status',
    enum: ['active', 'completed', 'paused', 'abandoned'],
    example: 'active',
  })
  status: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  static fromEntity(goal: Goal): GoalResponseDto {
    return {
      id: goal.id,
      externalUserId: goal.externalUserId,
      name: goal.name,
      type: goal.type,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      progress: goal.progress,
      status: goal.status,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
  }
}

export const goalApiTags = ApiTags('goals');
export const goalApiBearerAuth = ApiBearerAuth('JWT-auth');

export const listGoalsApiOperation = ApiOperation({
  summary: 'Get all goals for current user',
});

export const listGoalsApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'List of goals',
  type: [GoalResponseDto],
});

export const getGoalApiOperation = ApiOperation({
  summary: 'Get a specific goal',
});

export const getGoalApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Goal ID',
});

export const getGoalApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Goal details',
  type: GoalResponseDto,
});

export const updateProgressGoalApiOperation = ApiOperation({
  summary: 'Update goal progress',
});

export const updateProgressGoalApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Goal ID',
});

export const updateProgressGoalApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Progress updated successfully',
  type: GoalResponseDto,
});
