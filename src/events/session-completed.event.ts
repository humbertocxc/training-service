export interface SessionCompletedEvent {
  sessionId: number;
  externalUserId: string;
  groupExternalId?: string;
  workoutId?: number;
  date: Date;
  duration: number;
  exercises: Array<{
    exerciseId: number;
    setNumber: number;
    reps: number;
    load: number;
    rest: number | null;
    rpe?: number;
    tonnage: number;
  }>;
  totalTonnage: number;
  totalVolume: number;
  averageRpe?: number;
}

export const SESSION_COMPLETED_EVENT = 'session.completed';
