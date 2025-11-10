import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionResponseDto } from './session-response.dto';
import { SessionExerciseDto } from './create-session.dto';

export class UpdateSessionDto {
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
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    example: 3600,
    description: 'Duration in seconds (≥60)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(86400)
  duration?: number;

  @ApiProperty({ example: 'Great session!', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [SessionExerciseDto],
    description: 'Exercises to update',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionExerciseDto)
  exercises?: SessionExerciseDto[];
}

export const updateSessionApiOperation = ApiOperation({
  summary: 'Update training session',
  description:
    'Updates an existing training session for the authenticated user.',
});

export const updateSessionApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Training session ID',
});

export const updateSessionApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Training session successfully updated.',
  type: SessionResponseDto,
});

export const updateSessionApiResponseBadRequest = ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid input data or validation errors.',
});

export const updateSessionApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const updateSessionApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const updateSessionApiResponseNotFound = ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Training session not found or does not belong to user.',
});
