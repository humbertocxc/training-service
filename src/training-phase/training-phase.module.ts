import { Module } from '@nestjs/common';
import { TrainingPhaseController } from './training-phase.controller';
import { TrainingPhaseService } from './training-phase.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainingPhaseController],
  providers: [TrainingPhaseService],
  exports: [TrainingPhaseService],
})
export class TrainingPhaseModule {}
