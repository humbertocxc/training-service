import { ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
  Min,
  Max,
  ArrayMinSize,
  registerDecorator,
  ValidationOptions,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionResponseDto } from './session-response.dto';

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
  @ApiProperty({
    example: 1,
    description: 'Exercise ID',
  })
  @IsInt()
  exerciseId: number;

  @ApiProperty({ example: 1, description: 'Set number within the exercise' })
  @IsInt()
  @Min(1)
  setNumber: number;

  @ApiProperty({ example: 5, description: 'Number of reps' })
  @IsInt()
  @Min(1)
  reps: number;

  @ApiProperty({ example: 20, description: 'Load (kg or % bodyweight)' })
  @IsInt()
  @Min(0)
  load: number;

  @ApiProperty({
    example: 60,
    required: false,
    description: 'Rest time in seconds between sets',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  rest?: number;

  @ApiProperty({
    example: 8,
    required: false,
    description: 'Rate of Perceived Exertion (1-10)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rpe?: number;

  @ApiProperty({
    example: 'Felt strong today',
    required: false,
    description: 'Notes about the exercise',
  })
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
    description: 'Optional group external ID',
    example: 'group-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  groupExternalId?: string;

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
    description: 'Priority level of the session',
    enum: ['PRIMARY', 'SECONDARY', 'RECOVERY'],
    example: 'PRIMARY',
  })
  @IsEnum(['PRIMARY', 'SECONDARY', 'RECOVERY'])
  priority: 'PRIMARY' | 'SECONDARY' | 'RECOVERY';

  @ApiProperty({
    description: 'Type of session',
    enum: ['STRENGTH', 'SKILL', 'MOBILITY', 'CONDITIONING'],
    example: 'STRENGTH',
  })
  @IsEnum(['STRENGTH', 'SKILL', 'MOBILITY', 'CONDITIONING'])
  type: 'STRENGTH' | 'SKILL' | 'MOBILITY' | 'CONDITIONING';

  @ApiProperty({
    description: 'Session division (e.g., Push, Pull, Full Body, Legs)',
    example: 'Push',
  })
  @IsString()
  @IsNotEmpty()
  division: string;

  @ApiProperty({
    type: [SessionExerciseDto],
    description: 'Exercises performed in the session with per-set details',
    example: [
      {
        exerciseId: 1,
        setNumber: 1,
        reps: 10,
        load: 20,
        rest: 60,
        rpe: 8,
        notes: 'Felt strong',
      },
      {
        exerciseId: 1,
        setNumber: 2,
        reps: 8,
        load: 25,
        rest: 90,
        rpe: 9,
        notes: 'Last rep was tough',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SessionExerciseDto)
  exercises: SessionExerciseDto[];
}

export const createSessionApiOperation = ApiOperation({
  summary: 'Log training session',
  description:
    'Records a completed training session for the authenticated user. Session duration must be at least 60 seconds and date cannot be more than 24 hours in the future.',
});

export const createSessionApiResponseCreated = ApiResponse({
  status: HttpStatus.CREATED,
  description: 'Training session successfully logged.',
  type: SessionResponseDto,
});

export const createSessionApiResponseBadRequest = ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid input data or validation errors.',
});

export const createSessionApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const createSessionApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});
