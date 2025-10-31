import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const deleteWorkoutApiOperation = ApiOperation({
  summary: 'Delete workout template',
  description: 'Deletes a workout template by ID for the authenticated user.',
});

export const deleteWorkoutApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Workout template ID',
});

export const deleteWorkoutApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Workout template successfully deleted.',
});

export const deleteWorkoutApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const deleteWorkoutApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const deleteWorkoutApiResponseNotFound = ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Workout template not found or does not belong to user.',
});
