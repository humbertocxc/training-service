import { Module } from '@nestjs/common';
import { WorkoutService } from './services/workout.service';
import { WorkoutController } from './workout.controller';

@Module({
  providers: [WorkoutService],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
