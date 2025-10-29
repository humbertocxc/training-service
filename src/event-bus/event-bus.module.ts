import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventPublisherService } from './event-publisher.service';

@Module({
  imports: [ConfigModule],
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class EventBusModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly publisher: EventPublisherService) {}

  async onModuleInit() {
    await this.publisher.connect();
  }

  async onModuleDestroy() {
    await this.publisher.disconnect();
  }
}
