import { Injectable, OnModuleInit } from '@nestjs/common';
import { Exercise } from '@prisma/client';
import { ExerciseCategory } from './exercise.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExerciseService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.seedExercises();
  }

  async seedExercises(): Promise<void> {
    const defaultExercises = [
      {
        name: 'Push Up',
        category: ExerciseCategory.PUSH,
        description: 'A basic push exercise.',
        mediaUrl: 'https://example.com/pushup.jpg',
      },
      {
        name: 'Pull Up',
        category: ExerciseCategory.PULL,
        description: 'A basic pull exercise.',
        mediaUrl: 'https://example.com/pullup.jpg',
      },
      {
        name: 'Plank',
        category: ExerciseCategory.CORE,
        description: 'Core stability exercise.',
        mediaUrl: 'https://example.com/plank.jpg',
      },
      {
        name: 'Squat',
        category: ExerciseCategory.LEGS,
        description: 'Leg strength exercise.',
        mediaUrl: 'https://example.com/squat.jpg',
      },
      {
        name: 'Handstand',
        category: ExerciseCategory.SKILL,
        description: 'Skill-based exercise.',
        mediaUrl: 'https://example.com/handstand.jpg',
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
