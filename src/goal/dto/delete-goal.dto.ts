import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const deleteGoalApiOperation = ApiOperation({
  summary: 'Delete a goal',
});

export const deleteGoalApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Goal ID',
});

export const deleteGoalApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Goal deleted successfully',
});
