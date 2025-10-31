import {
  ApiProperty,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { IsString, IsNumber, IsIn, IsOptional, Min } from 'class-validator';
import { GoalResponseDto } from '../goal-response.dto';

export class UpdateGoalDto {
  @ApiProperty({
    description: 'Goal name',
    example: 'Achieve 25 pull-ups',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Target value to achieve',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @ApiProperty({
    description: 'Current value',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @ApiProperty({
    description: 'Goal status',
    enum: ['active', 'completed', 'paused', 'abandoned'],
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'completed', 'paused', 'abandoned'])
  status?: string;
}

export const updateGoalApiOperation = ApiOperation({
  summary: 'Update a goal',
});

export const updateGoalApiParam = ApiParam({
  name: 'id',
  type: 'number',
  description: 'Goal ID',
});

export const updateGoalApiResponseOk = ApiResponse({
  status: HttpStatus.OK,
  description: 'Goal updated successfully',
  type: GoalResponseDto,
});
