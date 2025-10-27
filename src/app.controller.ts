import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description:
      'Returns service health status including database connectivity, uptime, and response latency. Use this endpoint for monitoring and load balancer health checks.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service is healthy or degraded (check status field)',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['ok', 'degraded'],
          example: 'ok',
          description:
            'ok = fully operational, degraded = database connectivity issues',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-27T10:30:00Z',
          description: 'Current server timestamp (ISO 8601)',
        },
        uptime: {
          type: 'number',
          example: 123456,
          description: 'Process uptime in seconds',
        },
        database: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['connected', 'disconnected', 'error'],
              example: 'connected',
              description: 'Database connection status',
            },
            latency: {
              type: 'number',
              example: 5,
              description: 'Database query latency in milliseconds',
            },
          },
        },
      },
    },
  })
  async health() {
    const startTime = Date.now();

    let dbStatus = 'disconnected';
    let dbLatency = 0;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - startTime;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        latency: dbLatency,
      },
    };
  }
}
