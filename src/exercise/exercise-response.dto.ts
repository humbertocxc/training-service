import { ApiProperty } from '@nestjs/swagger';
import { Exercise as PrismaExercise } from '@prisma/client';

export class ExerciseResponseDto implements PrismaExercise {
  @ApiProperty({
    description: 'Unique exercise identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Exercise name',
    example: 'Pull-up',
  })
  name: string;

  @ApiProperty({
    description: 'Exercise category',
    example: 'Upper Body Pull',
  })
  category: string;

  @ApiProperty({
    description: 'Exercise description and form cues',
    example:
      'Hang from bar with arms extended, pull body up until chin is over bar',
  })
  description: string;

  @ApiProperty({
    description: 'URL to exercise demonstration media',
    example: 'https://example.com/exercises/pullup.mp4',
    nullable: true,
  })
  mediaUrl: string | null;

  @ApiProperty({
    description: 'Reference to image/media ID in media service',
    nullable: true,
    required: false,
  })
  imageId: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-10-27T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-10-27T10:00:00Z',
  })
  updatedAt: Date;

  static fromEntity(exercise: PrismaExercise): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      mediaUrl: exercise.mediaUrl,
      imageId: exercise.imageId,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
