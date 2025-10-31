import { ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsISO8601,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateTrainingPhaseDto {
  @ApiProperty({
    description: 'Phase name',
    example: 'Strength Building Block',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Associated goal ID (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  goalId?: number;

  @ApiProperty({
    description: 'Start date (ISO 8601 format)',
    example: '2025-11-01T00:00:00Z',
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    description: 'End date (ISO 8601 format, optional)',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiProperty({
    description: 'Array of workout IDs to associate with this phase',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  workoutIds?: number[];
}

export const createTrainingPhaseApiOperation = ApiOperation({
  summary: 'Create a new training phase',
});

export const createTrainingPhaseApiResponseOk = ApiResponse({
  status: 201,
  description: 'Training phase created successfully',
  type: CreateTrainingPhaseDto,
});
