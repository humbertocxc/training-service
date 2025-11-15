import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Session, SessionExercise } from '@prisma/client';
import { CreateSessionDto } from '../dto/create-session.dto';
import { QuerySessionDto } from '../dto/query-session.dto';
import { PrismaService } from '@/prisma/prisma.service';
import {
  SessionCompletedEvent,
  SESSION_COMPLETED_EVENT,
} from '@/events/session-completed.event';
import { EventPublisherService } from '@/event-bus/event-publisher.service';
import { SessionCompletedEventDto } from '@/event-bus/dto/session-completed-event.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  async create(
    externalUserId: string,
    dto: CreateSessionDto,
  ): Promise<Session> {
    const data: any = {
      externalUserId,
      groupExternalId: dto.groupExternalId,
      date: new Date(dto.date),
      duration: dto.duration,
      notes: dto.notes,
      priority: dto.priority,
      type: dto.type,
      division: dto.division,
      exercises: {
        create: dto.exerciseIds.map((exerciseId) => {
          return {
            exercise: { connect: { id: exerciseId } },
            reps: 0,
            sets: 0,
            load: 0,
            rpe: null,
            tonnage: 0,
            notes: null,
          };
        }),
      },
    };

    if (dto.workoutId !== undefined) {
      data.workoutId = dto.workoutId;
    }

    const created = await this.prisma.session.create({
      data,
      include: { exercises: true },
    });

    this.emitSessionCompletedEvent(
      created as Session & { exercises: SessionExercise[] },
    );

    return created as unknown as Session;
  }
  private emitSessionCompletedEvent(
    session: Session & { exercises: SessionExercise[] },
  ): void {
    const exercises = session.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets,
      reps: ex.reps,
      load: ex.load,
      rpe: ex.rpe ?? undefined,
      tonnage: ex.tonnage,
    }));

    const totalTonnage = exercises.reduce((sum, ex) => sum + ex.tonnage, 0);
    const totalVolume = exercises.reduce(
      (sum, ex) => sum + ex.reps * ex.sets,
      0,
    );
    const rpeValues = exercises
      .map((ex) => ex.rpe)
      .filter((r): r is number => r !== undefined);
    const averageRpe =
      rpeValues.length > 0
        ? rpeValues.reduce((sum, r) => sum + r, 0) / rpeValues.length
        : undefined;

    const event: SessionCompletedEvent = {
      sessionId: session.id,
      externalUserId: session.externalUserId,
      groupExternalId: session.groupExternalId ?? undefined,
      workoutId: session.workoutId ?? undefined,
      date: session.date,
      duration: session.duration,
      exercises,
      totalTonnage,
      totalVolume,
      averageRpe,
    };

    this.eventEmitter.emit(SESSION_COMPLETED_EVENT, event);

    const eventDto: SessionCompletedEventDto = {
      eventType: 'training.session.completed',
      timestamp: new Date().toISOString(),
      userExternalId: session.externalUserId,
      session: {
        sessionId: session.id.toString(),
        workoutId: session.workoutId?.toString(),
        date: session.date.toISOString(),
        duration: session.duration,
        perceivedEffort: averageRpe,
        notes: session.notes ?? undefined,
      },
    };

    this.eventPublisher
      .publish('training.session.completed', eventDto)
      .catch((error) => {
        console.error('Failed to publish session.completed event:', error);
      });
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

    const res = await this.prisma.session.findMany({
      where: {
        externalUserId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      include: { exercises: { include: { exercise: true } } },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    return res as unknown as (Session & {
      exercises: (SessionExercise & { exercise: any })[];
    })[];
  }

  async findOneForUser(id: number, externalUserId: string) {
    const res = await this.prisma.session.findFirst({
      where: { id, externalUserId },
      include: { exercises: { include: { exercise: true } } },
    });

    return res as unknown as Session & {
      exercises: (SessionExercise & { exercise: any })[];
    };
  }

  async getExerciseProgress(
    externalUserId: string,
    exerciseId: number,
    limit?: number,
  ) {
    const sessions = await this.prisma.sessionExercise.findMany({
      where: {
        exerciseId,
        session: {
          externalUserId,
        },
      },
      include: {
        session: {
          select: {
            id: true,
            date: true,
            externalUserId: true,
          },
        },
        exercise: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        session: {
          date: 'desc',
        },
      },
      take: limit || 50,
    });

    const history = sessions.map((s) => ({
      sessionId: s.session.id,
      date: s.session.date,
      sets: s.sets,
      reps: s.reps,
      load: s.load,
      rpe: s.rpe,
      tonnage: s.tonnage,
      notes: s.notes,
    }));

    const aggregates = {
      totalSessions: sessions.length,
      totalVolume: sessions.reduce((sum, s) => sum + s.reps * s.sets, 0),
      totalTonnage: sessions.reduce((sum, s) => sum + s.tonnage, 0),
      averageLoad: sessions.length
        ? sessions.reduce((sum, s) => sum + s.load, 0) / sessions.length
        : 0,
      averageRpe:
        sessions.filter((s) => s.rpe !== null).length > 0
          ? sessions
              .filter((s) => s.rpe !== null)
              .reduce((sum, s, _, arr) => sum + (s.rpe || 0) / arr.length, 0)
          : 0,
      maxLoad: Math.max(...sessions.map((s) => s.load), 0),
      maxReps: Math.max(...sessions.map((s) => s.reps), 0),
    };

    return {
      exercise: sessions[0]?.exercise,
      history,
      aggregates,
    };
  }
}
