import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { ExerciseModule } from './exercise/exercise.module';
import { WorkoutModule } from './workout/workout.module';
import { SessionModule } from './session/session.module';
import { GoalModule } from './goal/goal.module';
import { TrainingPhaseModule } from './training-phase/training-phase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    ExerciseModule,
    WorkoutModule,
    SessionModule,
    GoalModule,
    TrainingPhaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
