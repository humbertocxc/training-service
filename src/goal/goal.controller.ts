import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './goal-response.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  goalApiTags,
  goalApiBearerAuth,
  listGoalsApiOperation,
  listGoalsApiResponseOk,
  getGoalApiOperation,
  getGoalApiParam,
  getGoalApiResponseOk,
  updateProgressGoalApiOperation,
  updateProgressGoalApiParam,
  updateProgressGoalApiResponseOk,
} from './goal-response.dto';
import {
  createGoalApiOperation,
  createGoalApiResponseCreated,
} from './dto/create-goal.dto';
import {
  updateGoalApiOperation,
  updateGoalApiParam,
  updateGoalApiResponseOk,
} from './dto/update-goal.dto';
import {
  deleteGoalApiOperation,
  deleteGoalApiParam,
  deleteGoalApiResponseOk,
} from './dto/delete-goal.dto';

@goalApiTags
@goalApiBearerAuth
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  private getUserIdOrThrow(req: Request): string {
    const jwtUserId = req.user?.externalUserId;
    if (!jwtUserId) {
      throw new UnauthorizedException('Missing user authentication');
    }
    return jwtUserId;
  }

  @Post()
  @createGoalApiOperation
  @createGoalApiResponseCreated
  async create(
    @Req() req: Request,
    @Body() dto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const goal = await this.goalService.create(userId, dto);
    return GoalResponseDto.fromEntity(goal);
  }

  @Get()
  @listGoalsApiOperation
  @listGoalsApiResponseOk
  async findAll(@Req() req: Request): Promise<GoalResponseDto[]> {
    const userId = this.getUserIdOrThrow(req);
    const goals = await this.goalService.findByUser(userId);
    return goals.map((g) => GoalResponseDto.fromEntity(g));
  }

  @Get(':id')
  @getGoalApiOperation
  @getGoalApiParam
  @getGoalApiResponseOk
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GoalResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const goal = await this.goalService.findOneForUser(id, userId);
    return GoalResponseDto.fromEntity(goal);
  }

  @Put(':id')
  @updateGoalApiOperation
  @updateGoalApiParam
  @updateGoalApiResponseOk
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const goal = await this.goalService.update(id, userId, dto);
    return GoalResponseDto.fromEntity(goal);
  }

  @Delete(':id')
  @deleteGoalApiOperation
  @deleteGoalApiParam
  @deleteGoalApiResponseOk
  async delete(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    const userId = this.getUserIdOrThrow(req);
    await this.goalService.delete(id, userId);
    return { success: true };
  }

  @Put(':id/progress')
  @updateProgressGoalApiOperation
  @updateProgressGoalApiParam
  @updateProgressGoalApiResponseOk
  async updateProgress(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('currentValue') currentValue: number,
  ): Promise<GoalResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const goal = await this.goalService.updateProgress(
      id,
      userId,
      currentValue,
    );
    return GoalResponseDto.fromEntity(goal);
  }
}
