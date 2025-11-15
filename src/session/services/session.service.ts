import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Session, SessionExercise } from '@prisma/client';
import { CreateSessionDto } from '../dto/create-session.dto';
import { QuerySessionDto } from '../dto/query-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
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
    const exerciseIds = [...new Set(dto.exercises.map((e) => e.exerciseId))];
    const existingExercises = await this.prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true },
    });
    const existingIds = existingExercises.map((e) => e.id);
    const invalidIds = exerciseIds.filter((id) => !existingIds.includes(id));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid exercise IDs: ${invalidIds.join(', ')}`);
    }

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
        create: dto.exercises.map((exercise) => ({
          exercise: { connect: { id: exercise.exerciseId } },
          setNumber: exercise.setNumber,
          reps: exercise.reps,
          load: exercise.load,
          rest: exercise.rest,
          rpe: exercise.rpe,
          tonnage: exercise.load * exercise.reps,
          notes: exercise.notes,
        })),
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

  async update(
    sessionId: number,
    externalUserId: string,
    dto: UpdateSessionDto,
  ): Promise<Session> {
    const existingSession = await this.prisma.session.findFirst({
      where: { id: sessionId, externalUserId },
      include: { exercises: true },
    });

    if (!existingSession) {
      throw new Error('Session not found or does not belong to user');
    }

    const updateData: any = {};

    if (dto.workoutId !== undefined) updateData.workoutId = dto.workoutId;
    if (dto.groupExternalId !== undefined)
      updateData.groupExternalId = dto.groupExternalId;
    if (dto.date !== undefined) updateData.date = new Date(dto.date);
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    if (dto.exercises !== undefined) {
      // Delete existing exercises and create new ones
      updateData.exercises = {
        deleteMany: {},
        create: dto.exercises.map((exercise) => ({
          exercise: { connect: { id: exercise.exerciseId } },
          setNumber: exercise.setNumber,
          reps: exercise.reps,
          load: exercise.load,
          rest: exercise.rest,
          rpe: exercise.rpe,
          tonnage: exercise.load * exercise.reps,
          notes: exercise.notes,
        })),
      };
    }

    const updated = await this.prisma.session.update({
      where: { id: sessionId },
      data: updateData,
      include: { exercises: true },
    });

    return updated as unknown as Session;
  }

  private emitSessionCompletedEvent(
    session: Session & { exercises: SessionExercise[] },
  ): void {
    const exercises = session.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      setNumber: ex.setNumber,
      reps: ex.reps,
      load: ex.load,
      rest: ex.rest,
      rpe: ex.rpe ?? undefined,
      tonnage: ex.tonnage,
    }));

    const totalTonnage = exercises.reduce((sum, ex) => sum + ex.tonnage, 0);
    const totalVolume = exercises.reduce((sum, ex) => sum + ex.reps, 0);
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
    const sessionExercises = await this.prisma.sessionExercise.findMany({
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

    const sessionMap = new Map<
      number,
      {
        sessionId: number;
        date: Date;
        sets: Array<{
          setNumber: number;
          reps: number;
          load: number;
          rest?: number;
          rpe?: number;
          tonnage: number;
          notes?: string;
        }>;
      }
    >();

    for (const se of sessionExercises) {
      if (!sessionMap.has(se.sessionId)) {
        sessionMap.set(se.sessionId, {
          sessionId: se.sessionId,
          date: se.session.date,
          sets: [],
        });
      }
      sessionMap.get(se.sessionId)!.sets.push({
        setNumber: se.setNumber,
        reps: se.reps,
        load: se.load,
        rest: se.rest ?? undefined,
        rpe: se.rpe ?? undefined,
        tonnage: se.tonnage,
        notes: se.notes ?? undefined,
      });
    }

    const history = Array.from(sessionMap.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );

    const allSets = sessionExercises;
    const aggregates = {
      totalSessions: sessionMap.size,
      totalVolume: allSets.reduce((sum, s) => sum + s.reps, 0),
      totalTonnage: allSets.reduce((sum, s) => sum + s.tonnage, 0),
      averageLoad: allSets.length
        ? allSets.reduce((sum, s) => sum + s.load, 0) / allSets.length
        : 0,
      averageRpe:
        allSets.filter((s) => s.rpe !== null).length > 0
          ? allSets
              .filter((s) => s.rpe !== null)
              .reduce((sum, s, _, arr) => sum + (s.rpe || 0) / arr.length, 0)
          : 0,
      maxLoad: Math.max(...allSets.map((s) => s.load), 0),
      maxReps: Math.max(...allSets.map((s) => s.reps), 0),
    };

    return {
      exercise: sessionExercises[0]?.exercise,
      history,
      aggregates,
    };
  }
}
