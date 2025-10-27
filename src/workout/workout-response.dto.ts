import { ApiProperty } from '@nestjs/swagger';
import { ExerciseResponseDto } from '../exercise/exercise-response.dto';

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
