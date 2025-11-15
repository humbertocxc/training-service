import {
  ApiProperty,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ExerciseResponseDto } from '@/exercise/dto/exercise-response.dto';

export class SessionExerciseResponseDto {
  @ApiProperty({
    description: 'Session-exercise relation ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Exercise details',
    type: () => ExerciseResponseDto,
  })
  exercise: ExerciseResponseDto;

  @ApiProperty({
    description: 'Set number within the exercise',
    example: 1,
  })
  setNumber: number;

  @ApiProperty({
    description: 'Actual reps performed',
    example: 10,
  })
  reps: number;

  @ApiProperty({
    description: 'Load used',
    example: 20,
  })
  load: number;

  @ApiProperty({
    description: 'Rest time in seconds',
    nullable: true,
    required: false,
    example: 60,
  })
  rest: number | null;

  @ApiProperty({
    description: 'Rate of Perceived Exertion',
    nullable: true,
    required: false,
    example: 8,
  })
  rpe: number | null;

  @ApiProperty({
    description: 'Tonnage (load × reps)',
    example: 200,
  })
  tonnage: number;

  @ApiProperty({
    description: 'Exercise-specific notes',
    nullable: true,
    required: false,
  })
  notes: string | null;
}

export class SessionResponseDto {
  @ApiProperty({
    description: 'Unique session identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID who owns this session',
    example: 'user-123',
  })
  externalUserId: string;

  @ApiProperty({
    description: 'Optional reference to workout template used',
    nullable: true,
    required: false,
  })
  workoutId: number | null;

  @ApiProperty({
    description: 'Session date and time',
    example: '2025-10-27T10:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Session duration in seconds',
    example: 3600,
  })
  duration: number;

  @ApiProperty({
    description: 'Session notes',
    nullable: true,
    required: false,
  })
  notes: string | null;

  @ApiProperty({
    description: 'List of exercises performed in this session',
    type: [SessionExerciseResponseDto],
  })
  exercises: SessionExerciseResponseDto[];
}

export const sessionApiTags = ApiTags('sessions');
export const sessionApiBearerAuth = ApiBearerAuth('JWT-auth');

export const listSessionApiOperation = ApiOperation({
  summary: 'List training sessions',
  description:
    'Returns training sessions for the authenticated user with optional date filtering and pagination.',
});

export const listSessionApiQueryFrom = ApiQuery({
  name: 'from',
  required: false,
  type: String,
  description: 'Filter sessions from this date (ISO 8601)',
  example: '2025-01-01T00:00:00Z',
});

export const listSessionApiQueryTo = ApiQuery({
  name: 'to',
  required: false,
  type: String,
  description: 'Filter sessions until this date (ISO 8601)',
  example: '2025-12-31T23:59:59Z',
});

export const listSessionApiQueryLimit = ApiQuery({
  name: 'limit',
  required: false,
  type: Number,
  description: 'Maximum number of sessions to return (1-100)',
  example: 50,
});

export const listSessionApiQueryOffset = ApiQuery({
  name: 'offset',
  required: false,
  type: Number,
  description: 'Number of sessions to skip for pagination',
  example: 0,
});

export const listSessionApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'List of user training sessions.',
  type: [SessionResponseDto],
});

export const listSessionApiResponseBadRequest = ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid query parameters.',
});

export const listSessionApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const listSessionApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const getSessionApiOperation = ApiOperation({
  summary: 'Get training session by ID',
  description:
    'Returns a single training session by ID for the authenticated user.',
});

export const getSessionApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Training session ID',
});

export const getSessionApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Training session found.',
  type: SessionResponseDto,
});

export const getSessionApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const getSessionApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const getSessionApiResponseNotFound = ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Training session not found or does not belong to user.',
});

export const getExerciseProgressApiOperation = ApiOperation({
  summary: 'Get exercise progress history',
  description:
    'Returns progress history for a specific exercise including volume, tonnage, and RPE metrics over time.',
});

export const getExerciseProgressApiParam = ApiParam({
  name: 'exerciseId',
  type: 'number',
  description: 'Exercise ID to track progress for',
});

export const getExerciseProgressApiQueryLimit = ApiQuery({
  name: 'limit',
  required: false,
  type: 'number',
  description: 'Max number of sessions to return (default: 50)',
});

export const getExerciseProgressApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Exercise progress history retrieved successfully.',
});
