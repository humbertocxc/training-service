import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const deleteTrainingPhaseApiOperation = ApiOperation({
  summary: 'Delete a training phase',
});

export const deleteTrainingPhaseApiParam = ApiParam({
  name: 'id',
  description: 'Training phase ID',
  type: Number,
});

export const deleteTrainingPhaseApiResponseOk = ApiResponse({
  status: 200,
  description: 'Training phase deleted successfully',
});
