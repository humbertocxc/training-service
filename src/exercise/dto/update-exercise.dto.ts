import {
  ApiProperty,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ExerciseCategory } from './exercise.dto';
import { ExerciseResponseDto } from './exercise-response.dto';

export class UpdateExerciseDto {
  @ApiProperty({
    description: 'Exercise name',
    example: 'Diamond Push Up',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Exercise category',
    enum: ExerciseCategory,
    example: ExerciseCategory.PUSH,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExerciseCategory)
  category?: ExerciseCategory;

  @ApiProperty({
    description: 'Exercise description',
    example: 'A harder variation of push up.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Direct URL to image (fallback)',
    example: 'https://example.com/diamond-pushup.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @ApiProperty({
    description: 'Image ID from image microservice',
    example: 'img_456def',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageId?: string;
}

export const updateExerciseApiOperation = ApiOperation({
  summary: 'Update an exercise',
});

export const updateExerciseApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Unique exercise identifier',
  example: 1,
});

export const updateExerciseApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Exercise updated successfully',
  type: ExerciseResponseDto,
});
