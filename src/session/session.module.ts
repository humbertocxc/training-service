import { Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionController } from './session.controller';

@Module({
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
