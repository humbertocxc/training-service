import { Injectable } from '@nestjs/common';
import { Session, SessionExercise } from '@prisma/client';
import { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    externalUserId: string,
    dto: CreateSessionDto,
  ): Promise<Session> {
    const created = await this.prisma.session.create({
      data: {
        externalUserId,
        workoutId: dto.workoutId,
        date: new Date(dto.date),
        duration: dto.duration,
        notes: dto.notes,
        exercises: {
          create: dto.exercises.map((ex) => ({
            exercise: { connect: { id: ex.exerciseId } },
            actualReps: ex.actualReps,
            sets: ex.sets,
            notes: ex.notes,
          })),
        },
      },
      include: { exercises: true },
    });
    return created;
  }

  async findByUser(
    externalUserId: string,
    query?: QuerySessionDto,
  ): Promise<
    (Session & { exercises: (SessionExercise & { exercise: any })[] })[]
  > {
    const { from, to, limit = 50, offset = 0 } = query || {};

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (from) {
      dateFilter.gte = new Date(from);
    }
    if (to) {
      dateFilter.lte = new Date(to);
    }

    return this.prisma.session.findMany({
      where: {
        externalUserId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      include: { exercises: { include: { exercise: true } } },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findOneForUser(id: number, externalUserId: string) {
    return this.prisma.session.findFirst({
      where: { id, externalUserId },
      include: { exercises: { include: { exercise: true } } },
    });
  }
}
