import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export enum ExerciseCategory {
  PUSH = 'Push',
  PULL = 'Pull',
  CORE = 'Core',
  LEGS = 'Legs',
  SKILL = 'Skill',
}

export class ExerciseDto {
  @ApiProperty({ example: 'Push Up' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ExerciseCategory })
  @IsEnum(ExerciseCategory)
  category: ExerciseCategory;

  @ApiProperty({ example: 'A basic push exercise.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/pushup.jpg',
    required: false,
    description: 'Direct URL to image (fallback)',
  })
  @IsUrl()
  @IsOptional()
  mediaUrl?: string;

  @ApiProperty({
    example: 'img_123abc',
    required: false,
    description: 'Image ID from image microservice',
  })
  @IsString()
  @IsOptional()
  imageId?: string;
}
