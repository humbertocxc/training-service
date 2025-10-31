import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkoutResponseDto } from './workout-response.dto';
import { WorkoutExerciseDto } from './create-workout.dto';

export class UpdateWorkoutDto {
  @ApiProperty({ example: 'Morning Upper Body', required: false })
  @IsOptional()
  @IsString()
  name?: string;

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
    type: [WorkoutExerciseDto],
    description: 'Exercises to update',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];
}

export const updateWorkoutApiOperation = ApiOperation({
  summary: 'Update workout template',
  description:
    'Updates an existing workout template for the authenticated user.',
});

export const updateWorkoutApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Workout template ID',
});

export const updateWorkoutApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Workout template successfully updated.',
  type: WorkoutResponseDto,
});

export const updateWorkoutApiResponseBadRequest = ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid input data or validation errors.',
});

export const updateWorkoutApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const updateWorkoutApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const updateWorkoutApiResponseNotFound = ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Workout template not found or does not belong to user.',
});
