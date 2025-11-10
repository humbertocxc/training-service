import { Injectable, NotFoundException } from '@nestjs/common';
import { Goal } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(externalUserId: string, dto: CreateGoalDto): Promise<Goal> {
    const currentValue = dto.currentValue ?? 0;
    const progress = this.calculateProgress(currentValue, dto.targetValue);

    const created = await this.prisma.goal.create({
      data: {
        externalUserId,
        name: dto.name,
        type: dto.type,
        targetValue: dto.targetValue,
        currentValue,
        progress,
        status: 'active',
      },
    });

    return created as unknown as Goal;
  }

  async findByUser(externalUserId: string): Promise<Goal[]> {
    const goals = await this.prisma.goal.findMany({
      where: { externalUserId },
      orderBy: { createdAt: 'desc' },
    });

    return goals as unknown as Goal[];
  }

  async findOneForUser(id: number, externalUserId: string): Promise<Goal> {
    const goal = await this.prisma.goal.findFirst({
      where: { id, externalUserId },
      include: { TrainingPhase: true },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal as unknown as Goal;
  }

  async update(
    id: number,
    externalUserId: string,
    dto: UpdateGoalDto,
  ): Promise<Goal> {
    const existing = await this.findOneForUser(id, externalUserId);

    const targetValue = dto.targetValue ?? existing.targetValue;
    const currentValue = dto.currentValue ?? existing.currentValue;
    const progress = this.calculateProgress(currentValue, targetValue);

    let status = dto.status ?? existing.status;
    if (progress >= 100 && status === 'active') {
      status = 'completed';
    }

    const updated = await this.prisma.goal.update({
      where: { id },
      data: {
        name: dto.name,
        targetValue: dto.targetValue,
        currentValue: dto.currentValue,
        progress,
        status,
      },
    });

    return updated as unknown as Goal;
  }

  async delete(id: number, externalUserId: string): Promise<void> {
    await this.findOneForUser(id, externalUserId);
    await this.prisma.goal.delete({ where: { id } });
  }

  async updateProgress(
    id: number,
    externalUserId: string,
    currentValue: number,
  ): Promise<Goal> {
    const goal = await this.findOneForUser(id, externalUserId);
    const progress = this.calculateProgress(currentValue, goal.targetValue);

    let status = goal.status;
    if (progress >= 100 && status === 'active') {
      status = 'completed';
    }

    const updated = await this.prisma.goal.update({
      where: { id },
      data: {
        currentValue,
        progress,
        status,
      },
    });

    return updated as unknown as Goal;
  }

  private calculateProgress(current: number, target: number): number {
    if (target <= 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }
}
