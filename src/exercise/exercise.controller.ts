import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { Exercise } from '@prisma/client';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exercises' })
  @ApiResponse({ status: 200, description: 'List of exercises.' })
  async findAll(): Promise<Exercise[]> {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by id' })
  @ApiResponse({ status: 200, description: 'Exercise found.' })
  async findOne(@Param('id') id: string): Promise<Exercise | null> {
    return this.exerciseService.findOne(Number(id));
  }
}
