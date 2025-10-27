import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

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
    return this.exerciseService.findAll();
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
  async findOne(@Param('id') id: string): Promise<ExerciseResponseDto | null> {
    return this.exerciseService.findOne(Number(id));
  }
}
