import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsIn, IsOptional, Min } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({
    description: 'Goal name',
    example: 'Achieve 20 pull-ups',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Goal type',
    enum: ['reps', 'load', 'time', 'skill'],
    example: 'reps',
  })
  @IsIn(['reps', 'load', 'time', 'skill'])
  type: string;

  @ApiProperty({
    description: 'Target value to achieve',
    example: 20,
  })
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiProperty({
    description: 'Current value (optional, defaults to 0)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;
}
