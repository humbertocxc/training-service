import { Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionController } from './session.controller';
import { EventBusModule } from '../event-bus/event-bus.module';

@Module({
  imports: [EventBusModule],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
