import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';

function IsNotFutureDated(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDated',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const sessionDate = new Date(value);
          const now = new Date();
          const twentyFourHoursFromNow = new Date(
            now.getTime() + 24 * 60 * 60 * 1000,
          );
          return sessionDate <= twentyFourHoursFromNow;
        },
        defaultMessage() {
          return 'Session date cannot be more than 24 hours in the future';
        },
      },
    });
  };
}

export class SessionExerciseDto {
  @ApiProperty({ description: 'Exercise id', example: 1 })
  @IsInt()
  @Min(1)
  exerciseId: number;

  @ApiProperty({ example: 10, description: 'Actual reps performed (0-500)' })
  @IsInt()
  @Min(0)
  @Max(500)
  actualReps: number;

  @ApiProperty({ example: 3, description: 'Sets performed (1-50)' })
  @IsInt()
  @Min(1)
  @Max(50)
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

  @ApiProperty({
    example: '2025-10-27T10:00:00Z',
    description: 'Session date (cannot be >24h in future)',
  })
  @IsDateString()
  @IsNotFutureDated()
  date: string;

  @ApiProperty({ example: 3600, description: 'Duration in seconds (≥60)' })
  @IsInt()
  @Min(60)
  @Max(86400) // Max 24 hours
  duration: number;

  @ApiProperty({ example: 'Great session!', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [SessionExerciseDto],
    description: 'Must have at least 1 exercise',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SessionExerciseDto)
  exercises: SessionExerciseDto[];
}
