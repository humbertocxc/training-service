import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import {
  createExerciseApiOperation,
  createExerciseApiResponseCreated,
} from './dto/create-exercise.dto';
import {
  updateExerciseApiOperation,
  updateExerciseApiParam,
  updateExerciseApiResponseOk,
} from './dto/update-exercise.dto';
import {
  deleteExerciseApiOperation,
  deleteExerciseApiParam,
  deleteExerciseApiResponseOk,
} from './dto/delete-exercise.dto';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @createExerciseApiOperation
  @createExerciseApiResponseCreated
  async create(@Body() dto: CreateExerciseDto): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseService.create(dto);
    return ExerciseResponseDto.fromEntity(exercise);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exercises',
    description:
      'Returns the complete public catalog of calisthenics exercises. No authentication required.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all exercises in the catalog.',
    type: [ExerciseResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findAll(): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseService.findAll();
    return exercises.map((e) => ExerciseResponseDto.fromEntity(e));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get exercise by ID',
    description:
      'Returns a single exercise by its unique identifier. No authentication required.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique exercise identifier',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exercise found.',
    type: ExerciseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Exercise not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExerciseResponseDto | null> {
    const exercise = await this.exerciseService.findOne(id);
    return exercise ? ExerciseResponseDto.fromEntity(exercise) : null;
  }

  @Put(':id')
  @updateExerciseApiOperation
  @updateExerciseApiParam
  @updateExerciseApiResponseOk
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseService.update(id, dto);
    return ExerciseResponseDto.fromEntity(exercise);
  }

  @Delete(':id')
  @deleteExerciseApiOperation
  @deleteExerciseApiParam
  @deleteExerciseApiResponseOk
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    await this.exerciseService.delete(id);
    return { success: true };
  }
}
