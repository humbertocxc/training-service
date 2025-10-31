export interface SessionCompletedEventDto {
  eventType: 'training.session.completed';
  timestamp: string;
  userExternalId: string;
  session: {
    sessionId: string;
    workoutId?: string;
    date: string;
    duration: number;
    perceivedEffort?: number;
    notes?: string;
  };
}
