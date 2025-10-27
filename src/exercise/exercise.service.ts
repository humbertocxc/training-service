import { Injectable, OnModuleInit } from '@nestjs/common';
import { Exercise } from '@prisma/client';
import { ExerciseCategory } from './exercise.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExerciseService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    console.log('🌱 Seeding exercises on app startup...');
    await this.seedExercises();
    console.log('✅ Exercise seeding completed');
  }

  async seedExercises(): Promise<void> {
    const defaultExercises = [
      {
        name: 'Push Up',
        category: ExerciseCategory.PUSH,
        description: 'A basic push exercise.',
        mediaUrl: null,
        imageId: null,
      },
      {
        name: 'Pull Up',
        category: ExerciseCategory.PULL,
        description: 'A basic pull exercise.',
        mediaUrl: null,
        imageId: null,
      },
      {
        name: 'Plank',
        category: ExerciseCategory.CORE,
        description: 'Core stability exercise.',
        mediaUrl: null,
        imageId: null,
      },
      {
        name: 'Squat',
        category: ExerciseCategory.LEGS,
        description: 'Leg strength exercise.',
        mediaUrl: null,
        imageId: null,
      },
      {
        name: 'Handstand',
        category: ExerciseCategory.SKILL,
        description: 'Skill-based exercise.',
        mediaUrl: null,
        imageId: null,
      },
    ];
    for (const ex of defaultExercises) {
      await this.prisma.exercise.upsert({
        where: { name: ex.name },
        update: {},
        create: ex,
      });
    }
  }

  findAll(): Promise<Exercise[]> {
    return this.prisma.exercise.findMany();
  }

  findOne(id: number): Promise<Exercise | null> {
    return this.prisma.exercise.findUnique({ where: { id } });
  }
}
