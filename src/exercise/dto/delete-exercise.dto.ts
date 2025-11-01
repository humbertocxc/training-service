import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const deleteExerciseApiOperation = ApiOperation({
  summary: 'Delete an exercise',
});

export const deleteExerciseApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Unique exercise identifier',
  example: 1,
});

export const deleteExerciseApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Exercise deleted successfully',
});
