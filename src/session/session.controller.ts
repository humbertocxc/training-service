import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  UnauthorizedException,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionService } from './services/session.service';
import type { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  sessionApiTags,
  sessionApiBearerAuth,
  listSessionApiOperation,
  listSessionApiQueryFrom,
  listSessionApiQueryTo,
  listSessionApiQueryLimit,
  listSessionApiQueryOffset,
  listSessionApiResponseOk,
  listSessionApiResponseBadRequest,
  listSessionApiResponseUnauthorized,
  listSessionApiResponseForbidden,
  getSessionApiOperation,
  getSessionApiParam,
  getSessionApiResponseOk,
  getSessionApiResponseUnauthorized,
  getSessionApiResponseForbidden,
  getSessionApiResponseNotFound,
  getExerciseProgressApiOperation,
  getExerciseProgressApiParam,
  getExerciseProgressApiQueryLimit,
  getExerciseProgressApiResponseOk,
} from './session-response.dto';
import {
  createSessionApiOperation,
  createSessionApiResponseCreated,
  createSessionApiResponseBadRequest,
  createSessionApiResponseUnauthorized,
  createSessionApiResponseForbidden,
} from './dto/create-session.dto';

@sessionApiTags
@sessionApiBearerAuth
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  private getUserIdOrThrow(req: Request): string {
    const jwtUserId = req.user?.externalUserId;
    if (!jwtUserId) {
      throw new UnauthorizedException('Missing user authentication');
    }
    return jwtUserId;
  }

  @Post()
  @createSessionApiOperation
  @createSessionApiResponseCreated
  @createSessionApiResponseBadRequest
  @createSessionApiResponseUnauthorized
  @createSessionApiResponseForbidden
  async create(@Req() req: Request, @Body() dto: CreateSessionDto) {
    const userId = this.getUserIdOrThrow(req);
    return this.sessionService.create(userId, dto);
  }

  @Get()
  @listSessionApiOperation
  @listSessionApiQueryFrom
  @listSessionApiQueryTo
  @listSessionApiQueryLimit
  @listSessionApiQueryOffset
  @listSessionApiResponseOk
  @listSessionApiResponseBadRequest
  @listSessionApiResponseUnauthorized
  @listSessionApiResponseForbidden
  async list(@Req() req: Request, @Query() query: QuerySessionDto) {
    const userId = this.getUserIdOrThrow(req);
    return this.sessionService.findByUser(userId, query);
  }

  @Get(':id')
  @getSessionApiOperation
  @getSessionApiParam
  @getSessionApiResponseOk
  @getSessionApiResponseUnauthorized
  @getSessionApiResponseForbidden
  @getSessionApiResponseNotFound
  async get(@Req() req: Request, @Param('id') id: string) {
    const userId = this.getUserIdOrThrow(req);
    return this.sessionService.findOneForUser(Number(id), userId);
  }

  @Get('progress/:exerciseId')
  @getExerciseProgressApiOperation
  @getExerciseProgressApiParam
  @getExerciseProgressApiQueryLimit
  @getExerciseProgressApiResponseOk
  async getExerciseProgress(
    @Req() req: Request,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Query('limit') limit?: number,
  ) {
    const userId = this.getUserIdOrThrow(req);
    return this.sessionService.getExerciseProgress(
      userId,
      exerciseId,
      limit ? Number(limit) : undefined,
    );
  }
}
