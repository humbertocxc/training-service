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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './goal-response.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('goals')
@ApiBearerAuth('JWT-auth')
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
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({
    status: 201,
    description: 'Goal created successfully',
    type: GoalResponseDto,
  })
  async create(
    @Req() req: Request,
    @Body() dto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const goal = await this.goalService.create(userId, dto);
    return GoalResponseDto.fromEntity(goal);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of goals',
    type: [GoalResponseDto],
  })
  async findAll(@Req() req: Request): Promise<GoalResponseDto[]> {
    const userId = this.getUserIdOrThrow(req);
    const goals = await this.goalService.findByUser(userId);
    return goals.map((g) => GoalResponseDto.fromEntity(g));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific goal' })
  @ApiResponse({
    status: 200,
    description: 'Goal details',
    type: GoalResponseDto,
  })
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GoalResponseDto> {
    const userId = this.getUserIdOrThrow(req);
    const goal = await this.goalService.findOneForUser(id, userId);
    return GoalResponseDto.fromEntity(goal);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a goal' })
  @ApiResponse({
    status: 200,
    description: 'Goal updated successfully',
    type: GoalResponseDto,
  })
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
  @ApiOperation({ summary: 'Delete a goal' })
  @ApiResponse({
    status: 200,
    description: 'Goal deleted successfully',
  })
  async delete(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    const userId = this.getUserIdOrThrow(req);
    await this.goalService.delete(id, userId);
    return { success: true };
  }

  @Put(':id/progress')
  @ApiOperation({ summary: 'Update goal progress' })
  @ApiResponse({
    status: 200,
    description: 'Progress updated successfully',
    type: GoalResponseDto,
  })
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
