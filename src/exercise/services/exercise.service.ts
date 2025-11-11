import { Injectable, NotFoundException } from '@nestjs/common';
import { Exercise } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExerciseDto): Promise<Exercise> {
    const exercise = await this.prisma.exercise.create({
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        mediaUrl: dto.mediaUrl,
        imageId: dto.imageId,
      },
    });
    return exercise;
  }

  async findAll(): Promise<Exercise[]> {
    return this.prisma.exercise.findMany();
  }

  async findOne(id: number): Promise<Exercise | null> {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateExerciseDto): Promise<Exercise> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    const exercise = await this.prisma.exercise.update({
      where: { id },
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        mediaUrl: dto.mediaUrl,
        imageId: dto.imageId,
      },
    });
    return exercise;
  }

  async delete(id: number): Promise<void> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    await this.prisma.exercise.delete({ where: { id } });
  }
}
