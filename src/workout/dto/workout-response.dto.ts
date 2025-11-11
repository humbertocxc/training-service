import {
  ApiProperty,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ExerciseResponseDto } from '@/exercise/dto/exercise-response.dto';

export class WorkoutExerciseResponseDto {
  @ApiProperty({
    description: 'Workout-exercise relation ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Exercise details',
    type: () => ExerciseResponseDto,
  })
  exercise: ExerciseResponseDto;

  @ApiProperty({
    description: 'Number of sets',
    example: 3,
  })
  sets: number;

  @ApiProperty({
    description: 'Target reps per set',
    example: 8,
  })
  reps: number;

  @ApiProperty({
    description: 'Rest time between sets (seconds)',
    example: 60,
  })
  rest: number;

  @ApiProperty({
    description: 'Exercise-specific notes',
    nullable: true,
    required: false,
  })
  notes: string | null;
}

export class WorkoutResponseDto {
  @ApiProperty({
    description: 'Unique workout template identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID who owns this workout',
    example: 'user-123',
  })
  externalUserId: string;

  @ApiProperty({
    description: 'Workout template name',
    example: 'Morning Upper Body',
  })
  name: string;

  @ApiProperty({
    description: 'Workout notes',
    nullable: true,
    required: false,
  })
  notes: string | null;

  @ApiProperty({
    description: 'List of exercises in this workout',
    type: [WorkoutExerciseResponseDto],
  })
  exercises: WorkoutExerciseResponseDto[];
}

export const workoutApiTags = ApiTags('workouts');

export const workoutApiBearerAuth = ApiBearerAuth('JWT-auth');

export const listWorkoutApiOperation = ApiOperation({
  summary: 'List workout templates',
  description: 'Returns all workout templates for the authenticated user.',
});

export const listWorkoutApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'List of user workout templates.',
  type: [WorkoutResponseDto],
});

export const listWorkoutApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const listWorkoutApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const getWorkoutApiOperation = ApiOperation({
  summary: 'Get workout template by ID',
  description:
    'Returns a single workout template by ID for the authenticated user.',
});

export const getWorkoutApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Workout template ID',
});

export const getWorkoutApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Workout template found.',
  type: WorkoutResponseDto,
});

export const getWorkoutApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const getWorkoutApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const getWorkoutApiResponseNotFound = ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Workout template not found or does not belong to user.',
});
