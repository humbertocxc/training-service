import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkoutExerciseDto {
  @ApiProperty({ description: 'Exercise id (existing Exercise)', example: 1 })
  @IsInt()
  @Min(1)
  exerciseId: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  sets: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  reps: number;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsInt()
  rest?: number;

  @ApiProperty({ example: 'Use full range of motion', required: false })
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

  @ApiProperty({ type: [WorkoutExerciseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];
}
