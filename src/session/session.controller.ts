import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  UnauthorizedException,
  UseGuards,
  ForbiddenException,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionService } from './services/session.service';
import type { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import { SessionResponseDto } from './session-response.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  private validateUserAccess(
    jwtUserId: string | undefined,
    urlUserId: string,
  ): void {
    if (!jwtUserId) {
      throw new UnauthorizedException('Missing user authentication');
    }
    if (jwtUserId !== urlUserId) {
      throw new ForbiddenException(
        'Access denied: You can only access your own resources',
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Log training session',
    description:
      'Records a completed training session for the authenticated user. Session duration must be at least 60 seconds and date cannot be more than 24 hours in the future.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Training session successfully logged.',
    type: SessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  async create(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.sessionService.create(userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List training sessions',
    description:
      'Returns training sessions for the authenticated user with optional date filtering and pagination.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Filter sessions from this date (ISO 8601)',
    example: '2025-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Filter sessions until this date (ISO 8601)',
    example: '2025-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of sessions to return (1-100)',
    example: 50,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of sessions to skip for pagination',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user training sessions.',
    type: [SessionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  async list(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Query() query: QuerySessionDto,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.sessionService.findByUser(userId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get training session by ID',
    description:
      'Returns a single training session by ID for the authenticated user.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Training session ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training session found.',
    type: SessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Attempting to access another user's resources.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Training session not found or does not belong to user.',
  })
  async get(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.sessionService.findOneForUser(Number(id), userId);
  }

  @Get('progress/:exerciseId')
  @ApiOperation({
    summary: 'Get exercise progress history',
    description:
      'Returns progress history for a specific exercise including volume, tonnage, and RPE metrics over time.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User identifier (must match JWT userId)',
  })
  @ApiParam({
    name: 'exerciseId',
    type: 'number',
    description: 'Exercise ID to track progress for',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Max number of sessions to return (default: 50)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exercise progress history retrieved successfully.',
  })
  async getExerciseProgress(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Query('limit') limit?: number,
  ) {
    this.validateUserAccess(req.user?.externalUserId, userId);
    return this.sessionService.getExerciseProgress(
      userId,
      exerciseId,
      limit ? Number(limit) : undefined,
    );
  }
}
