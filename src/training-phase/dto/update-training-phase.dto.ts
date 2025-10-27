import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsISO8601,
  IsArray,
  IsInt,
} from 'class-validator';

export class UpdateTrainingPhaseDto {
  @ApiProperty({
    description: 'Phase name',
    example: 'Strength Building Block - Extended',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Associated goal ID',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  goalId?: number;

  @ApiProperty({
    description: 'Start date (ISO 8601 format)',
    example: '2025-11-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiProperty({
    description: 'End date (ISO 8601 format)',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiProperty({
    description: 'Array of workout IDs to associate with this phase',
    example: [1, 2, 3, 4],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  workoutIds?: number[];
}
