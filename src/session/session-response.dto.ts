import { ApiProperty } from '@nestjs/swagger';
import { ExerciseResponseDto } from '../exercise/exercise-response.dto';

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
    description: 'Actual reps performed',
    example: 10,
  })
  actualReps: number;

  @ApiProperty({
    description: 'Number of sets performed',
    example: 3,
  })
  sets: number;

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
