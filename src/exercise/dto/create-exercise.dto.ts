import { ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ExerciseCategory } from '../exercise.dto';
import { ExerciseResponseDto } from '../exercise-response.dto';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Exercise name',
    example: 'Push Up',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Exercise category',
    enum: ExerciseCategory,
    example: ExerciseCategory.PUSH,
  })
  @IsEnum(ExerciseCategory)
  category: ExerciseCategory;

  @ApiProperty({
    description: 'Exercise description',
    example: 'A basic push exercise.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Direct URL to image (fallback)',
    example: 'https://example.com/pushup.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @ApiProperty({
    description: 'Image ID from image microservice',
    example: 'img_123abc',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageId?: string;
}

export const createExerciseApiOperation = ApiOperation({
  summary: 'Create a new exercise',
});

export const createExerciseApiResponseCreated = ApiResponse({
  status: HttpStatus.CREATED,
  description: 'Exercise created successfully',
  type: ExerciseResponseDto,
});
