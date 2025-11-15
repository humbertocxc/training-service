import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { WorkoutResponseDto } from './workout-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
  ArrayMinSize,
  Min,
} from 'class-validator';

export class WorkoutExerciseDto {
  @ApiProperty({
    example: 1,
    description: 'Exercise ID',
  })
  @IsInt()
  exerciseId: number;

  @ApiProperty({ example: 3, description: 'Number of sets' })
  @IsInt()
  @Min(1)
  sets: number;

  @ApiProperty({ example: 5, description: 'Number of reps' })
  @IsInt()
  @Min(1)
  reps: number;

  @ApiProperty({ example: 60, description: 'Rest time (in seconds)' })
  @IsInt()
  @Min(0)
  rest: number;

  @ApiProperty({
    example: 'Modify as needed',
    required: false,
    description: 'Notes about the exercise',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Morning Upper Body' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Notes about the workout', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Training focus tags',
    example: ['Strength', 'Power'],
    type: [String],
    required: false,
    enum: ['Strength', 'Skill', 'Endurance', 'Power', 'Mobility'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusTags?: string[];

  @ApiProperty({
    description: 'Optional group external ID',
    example: 'group-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  groupExternalId?: string;

  @ApiProperty({
    description: 'Priority level of the workout',
    enum: ['PRIMARY', 'SECONDARY', 'RECOVERY'],
    example: 'PRIMARY',
  })
  @IsEnum(['PRIMARY', 'SECONDARY', 'RECOVERY'])
  priority: 'PRIMARY' | 'SECONDARY' | 'RECOVERY';

  @ApiProperty({
    description: 'Type of workout',
    enum: ['STRENGTH', 'SKILL', 'MOBILITY', 'CONDITIONING'],
    example: 'STRENGTH',
  })
  @IsEnum(['STRENGTH', 'SKILL', 'MOBILITY', 'CONDITIONING'])
  type: 'STRENGTH' | 'SKILL' | 'MOBILITY' | 'CONDITIONING';

  @ApiProperty({
    description: 'Workout division (e.g., Push, Pull, Full Body, Legs)',
    example: 'Push',
  })
  @IsString()
  @IsNotEmpty()
  division: string;

  @ApiProperty({
    type: [WorkoutExerciseDto],
    description:
      'Array of exercises to include in the workout with their sets, reps, and rest.',
    example: [
      {
        exerciseId: 1,
        sets: 3,
        reps: 5,
        rest: 60,
        notes: 'Modify as needed',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  exercises: WorkoutExerciseDto[];
}

export const createWorkoutApiOperation = ApiOperation({
  summary: 'Create workout template',
  description:
    'Creates a new workout template for the authenticated user. A workout must have at least one exercise.',
});

export const createWorkoutApiResponseCreated = ApiResponse({
  status: HttpStatus.CREATED,
  description: 'Workout template successfully created.',
  type: WorkoutResponseDto,
});

export const createWorkoutApiResponseBadRequest = ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid input data or validation errors.',
});

export const createWorkoutApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const createWorkoutApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});
