import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const deleteSessionApiOperation = ApiOperation({
  summary: 'Delete training session',
  description: 'Deletes a training session by ID for the authenticated user.',
});

export const deleteSessionApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Training session ID',
});

export const deleteSessionApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Training session successfully deleted.',
});

export const deleteSessionApiResponseUnauthorized = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing or invalid JWT token.',
});

export const deleteSessionApiResponseForbidden = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Attempting to access another user's resources.",
});

export const deleteSessionApiResponseNotFound = ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Training session not found or does not belong to user.',
});
