import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './config/rabbitmq.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { ExerciseModule } from './exercise/exercise.module';
import { WorkoutModule } from './workout/workout.module';
import { SessionModule } from './session/session.module';
import { GoalModule } from './goal/goal.module';
import { TrainingPhaseModule } from './training-phase/training-phase.module';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [rabbitmqConfig] }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    EventBusModule,
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
