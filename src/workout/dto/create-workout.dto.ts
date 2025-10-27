import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkoutExerciseDto {
  @ApiProperty({ description: 'Exercise id (existing Exercise)', example: 1 })
  @IsInt()
  @Min(1)
  exerciseId: number;

  @ApiProperty({ example: 3, description: 'Number of sets (1-20)' })
  @IsInt()
  @Min(1)
  @Max(20)
  sets: number;

  @ApiProperty({ example: 8, description: 'Target reps per set (1-100)' })
  @IsInt()
  @Min(1)
  @Max(100)
  reps: number;

  @ApiProperty({
    example: 60,
    required: false,
    description: 'Rest between sets in seconds (0-600)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(600)
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
    description: 'Must have at least 1 exercise',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];
}
