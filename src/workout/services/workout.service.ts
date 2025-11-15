import { Injectable } from '@nestjs/common';
import { Workout, WorkoutExercise } from '@prisma/client';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class WorkoutService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    externalUserId: string,
    dto: CreateWorkoutDto,
  ): Promise<Workout> {
    const exerciseIds = dto.exercises.map((e) => e.exerciseId);
    const validExercises = await this.prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true },
    });

    const validExerciseIds = new Set(validExercises.map((ex) => ex.id));

    const created = await this.prisma.workout.create({
      data: {
        externalUserId,
        groupExternalId: dto.groupExternalId,
        name: dto.name,
        notes: dto.notes,
        focusTags: dto.focusTags || [],
        priority: dto.priority,
        type: dto.type,
        division: dto.division,
        exercises: {
          create: dto.exercises
            .filter((e) => validExerciseIds.has(e.exerciseId))
            .map((e) => ({
              exercise: { connect: { id: e.exerciseId } },
              sets: e.sets,
              reps: e.reps,
              rest: e.rest,
              notes: e.notes,
            })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
    return created;
  }

  async findByUser(
    externalUserId: string,
  ): Promise<
    (Workout & { exercises: (WorkoutExercise & { exercise: any })[] })[]
  > {
    return this.prisma.workout.findMany({
      where: { externalUserId },
      include: { exercises: { include: { exercise: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async findOneForUser(id: number, externalUserId: string) {
    return this.prisma.workout.findFirst({
      where: { id, externalUserId },
      include: { exercises: { include: { exercise: true } } },
    });
  }

  async deleteForUser(id: number, externalUserId: string) {
    const found = await this.prisma.workout.findFirst({
      where: { id, externalUserId },
    });
    if (!found) return null;
    await this.prisma.workout.delete({ where: { id } });
    return { success: true };
  }
}
