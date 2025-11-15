import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  Param,
  UnauthorizedException,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SessionService } from './services/session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
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
} from './dto/session-response.dto';
import {
  createSessionApiOperation,
  createSessionApiResponseCreated,
  createSessionApiResponseBadRequest,
  createSessionApiResponseUnauthorized,
  createSessionApiResponseForbidden,
} from './dto/create-session.dto';
import {
  updateSessionApiOperation,
  updateSessionApiParam,
  updateSessionApiResponseOk,
  updateSessionApiResponseBadRequest,
  updateSessionApiResponseUnauthorized,
  updateSessionApiResponseForbidden,
  updateSessionApiResponseNotFound,
} from './dto/update-session.dto';

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
  @ApiBody({ type: CreateSessionDto })
  @createSessionApiOperation
  @createSessionApiResponseCreated
  @createSessionApiResponseBadRequest
  @createSessionApiResponseUnauthorized
  @createSessionApiResponseForbidden
  async create(@Req() req: Request, @Body() dto: CreateSessionDto) {
    const userId = this.getUserIdOrThrow(req);
    return this.sessionService.create(userId, dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateSessionDto })
  @updateSessionApiOperation
  @updateSessionApiParam
  @updateSessionApiResponseOk
  @updateSessionApiResponseBadRequest
  @updateSessionApiResponseUnauthorized
  @updateSessionApiResponseForbidden
  @updateSessionApiResponseNotFound
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionDto,
  ) {
    const userId = this.getUserIdOrThrow(req);
    return this.sessionService.update(id, userId, dto);
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
