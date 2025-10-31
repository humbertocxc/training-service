import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, Options } from 'amqplib';

@Injectable()
export class EventPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventPublisherService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private readonly exchange: string;
  private readonly exchangeType: string;

  constructor(private readonly configService: ConfigService) {
    this.exchange = this.configService.get<string>(
      'rabbitmq.exchange',
      'training.events',
    );
    this.exchangeType = this.configService.get<string>(
      'rabbitmq.exchangeType',
      'topic',
    );
  }

  connect(): Promise<void> {
    const url = this.configService.get<string>(
      'rabbitmq.url',
      'amqp://guest:guest@localhost:5672',
    );

    this.logger.log(`Connecting to RabbitMQ at ${url}`);

    this.connection = amqp.connect([url], {
      heartbeatIntervalInSeconds: 30,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () => {
      this.logger.log('RabbitMQ connection established (Publisher)');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.warn('RabbitMQ connection lost (Publisher)', err?.err);
    });

    this.connection.on('connectFailed', (err) => {
      this.logger.error('RabbitMQ connection failed (Publisher)', err?.err);
    });

    this.channelWrapper = this.connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(this.exchange, this.exchangeType, {
          durable: true,
        });
        this.logger.log(
          `Exchange '${this.exchange}' (${this.exchangeType}) asserted`,
        );
      },
    });
    return Promise.resolve();
  }

  onModuleInit(): Promise<void> {
    return this.connect();
  }

  async publish(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    try {
      const message = JSON.stringify({
        eventType,
        timestamp: new Date().toISOString(),
        userExternalId: payload.userExternalId,
        ...payload,
      });

      const publishOptions: Options.Publish = {
        contentType: 'application/json',
        persistent: true,
      };

      await this.channelWrapper.publish(
        this.exchange,
        eventType,
        Buffer.from(message),
        publishOptions,
      );

      this.logger.log(`[Event Published] ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${eventType}`, error.stack);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channelWrapper) await this.channelWrapper.close();
      if (this.connection) await this.connection.close();
      this.logger.log('RabbitMQ connection closed (Publisher)');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error.stack);
    }
  }

  onModuleDestroy(): Promise<void> {
    return this.disconnect();
  }
}
