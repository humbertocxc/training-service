import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SessionExerciseDto {
  @ApiProperty({ description: 'Exercise id', example: 1 })
  @IsInt()
  @Min(1)
  exerciseId: number;

  @ApiProperty({ example: 10, description: 'Actual reps performed' })
  @IsInt()
  @Min(0)
  actualReps: number;

  @ApiProperty({ example: 3, description: 'Sets performed' })
  @IsInt()
  @Min(1)
  sets: number;

  @ApiProperty({ example: 'Felt good', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateSessionDto {
  @ApiProperty({
    example: 1,
    required: false,
    description: 'Optional workout template reference',
  })
  @IsOptional()
  @IsInt()
  workoutId?: number;

  @ApiProperty({ example: '2025-10-27T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 3600, description: 'Duration in seconds' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'Great session!', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [SessionExerciseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionExerciseDto)
  exercises: SessionExerciseDto[];
}
