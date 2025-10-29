import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'training.events',
  exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE || 'topic',
}));
