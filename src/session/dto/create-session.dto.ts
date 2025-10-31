import { ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionResponseDto } from '../session-response.dto';

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

  @ApiProperty({ example: 10, description: 'Reps performed per set (0-500)' })
  @IsInt()
  @Min(0)
  @Max(500)
  reps: number;

  @ApiProperty({ example: 3, description: 'Sets performed (1-50)' })
  @IsInt()
  @Min(1)
  @Max(50)
  sets: number;

  @ApiProperty({
    example: 0,
    description: 'Load in kg or % bodyweight (0-1000)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  load?: number;

  @ApiProperty({
    example: 8.5,
    description: 'Rate of Perceived Exertion (1-10)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rpe?: number;

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
    type: [SessionExerciseDto],
    description: 'Must have at least 1 exercise',
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
