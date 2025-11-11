import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TrainingPhase } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTrainingPhaseDto } from './dto/create-training-phase.dto';
import { UpdateTrainingPhaseDto } from './dto/update-training-phase.dto';

@Injectable()
export class TrainingPhaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    externalUserId: string,
    dto: CreateTrainingPhaseDto,
  ): Promise<TrainingPhase> {
    if (dto.goalId) {
      const goal = await this.prisma.goal.findFirst({
        where: { id: dto.goalId, externalUserId },
      });
      if (!goal) {
        throw new BadRequestException(
          `Goal with ID ${dto.goalId} not found or not owned by user`,
        );
      }
    }

    if (dto.workoutIds && dto.workoutIds.length > 0) {
      const workouts = await this.prisma.workout.findMany({
        where: { id: { in: dto.workoutIds }, externalUserId },
      });
      if (workouts.length !== dto.workoutIds.length) {
        throw new BadRequestException(
          'Some workouts not found or not owned by user',
        );
      }
    }

    const created = await this.prisma.trainingPhase.create({
      data: {
        externalUserId,
        name: dto.name,
        goalId: dto.goalId,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        workouts: dto.workoutIds
          ? {
              connect: dto.workoutIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        workouts: true,
        goal: true,
      },
    });

    return created as unknown as TrainingPhase;
  }

  async findByUser(externalUserId: string): Promise<TrainingPhase[]> {
    const phases = await this.prisma.trainingPhase.findMany({
      where: { externalUserId },
      include: {
        workouts: {
          select: {
            id: true,
            name: true,
            focusTags: true,
          },
        },
        goal: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return phases as unknown as TrainingPhase[];
  }

  async findOneForUser(
    id: number,
    externalUserId: string,
  ): Promise<TrainingPhase> {
    const phase = await this.prisma.trainingPhase.findFirst({
      where: { id, externalUserId },
      include: {
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
        goal: true,
      },
    });

    if (!phase) {
      throw new NotFoundException(`Training phase with ID ${id} not found`);
    }

    return phase as unknown as TrainingPhase;
  }

  async update(
    id: number,
    externalUserId: string,
    dto: UpdateTrainingPhaseDto,
  ): Promise<TrainingPhase> {
    await this.findOneForUser(id, externalUserId);

    if (dto.goalId) {
      const goal = await this.prisma.goal.findFirst({
        where: { id: dto.goalId, externalUserId },
      });
      if (!goal) {
        throw new BadRequestException(
          `Goal with ID ${dto.goalId} not found or not owned by user`,
        );
      }
    }

    if (dto.workoutIds && dto.workoutIds.length > 0) {
      const workouts = await this.prisma.workout.findMany({
        where: { id: { in: dto.workoutIds }, externalUserId },
      });
      if (workouts.length !== dto.workoutIds.length) {
        throw new BadRequestException(
          'Some workouts not found or not owned by user',
        );
      }
    }

    const updated = await this.prisma.trainingPhase.update({
      where: { id },
      data: {
        name: dto.name,
        goalId: dto.goalId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        workouts: dto.workoutIds
          ? {
              set: dto.workoutIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        workouts: true,
        goal: true,
      },
    });

    return updated as unknown as TrainingPhase;
  }

  async delete(id: number, externalUserId: string): Promise<void> {
    await this.findOneForUser(id, externalUserId);
    await this.prisma.trainingPhase.delete({ where: { id } });
  }

  async getCurrentPhases(externalUserId: string): Promise<TrainingPhase[]> {
    const now = new Date();
    const phases = await this.prisma.trainingPhase.findMany({
      where: {
        externalUserId,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: {
        workouts: {
          select: {
            id: true,
            name: true,
            focusTags: true,
          },
        },
        goal: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return phases as unknown as TrainingPhase[];
  }
}
