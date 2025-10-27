import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './goal-response.dto';

@ApiTags('goals')
@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Goal created successfully',
    type: GoalResponseDto,
  })
  async create(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const goal = await this.goalService.create(userId, dto);
    return GoalResponseDto.fromEntity(goal);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for current user' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of goals',
    type: [GoalResponseDto],
  })
  async findAll(
    @Headers('x-user-id') userId: string,
  ): Promise<GoalResponseDto[]> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const goals = await this.goalService.findByUser(userId);
    return goals.map((g) => GoalResponseDto.fromEntity(g));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific goal' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Goal details',
    type: GoalResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
  ): Promise<GoalResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const goal = await this.goalService.findOneForUser(id, userId);
    return GoalResponseDto.fromEntity(goal);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a goal' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Goal updated successfully',
    type: GoalResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
    @Body() dto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const goal = await this.goalService.update(id, userId, dto);
    return GoalResponseDto.fromEntity(goal);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Goal deleted successfully',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
  ): Promise<{ success: boolean }> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    await this.goalService.delete(id, userId);
    return { success: true };
  }

  @Put(':id/progress')
  @ApiOperation({ summary: 'Update goal progress' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'External user ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Progress updated successfully',
    type: GoalResponseDto,
  })
  async updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
    @Body('currentValue') currentValue: number,
  ): Promise<GoalResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    const goal = await this.goalService.updateProgress(
      id,
      userId,
      currentValue,
    );
    return GoalResponseDto.fromEntity(goal);
  }
}
