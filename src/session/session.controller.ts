import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SessionService } from './session.service';
import type { CreateSessionDto } from './dto/create-session.dto';
import type { Request } from 'express';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Log a workout session for authenticated user' })
  @ApiResponse({ status: 201, description: 'Session logged.' })
  async create(@Req() req: Request, @Body() dto: CreateSessionDto) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.sessionService.create(externalUserId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List sessions for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of sessions.' })
  async list(@Req() req: Request) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.sessionService.findByUser(externalUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by id for authenticated user' })
  async get(@Req() req: Request, @Param('id') id: string) {
    const externalUserId = req.user?.externalUserId;
    if (!externalUserId) throw new UnauthorizedException('Missing user');
    return this.sessionService.findOneForUser(Number(id), externalUserId);
  }
}
