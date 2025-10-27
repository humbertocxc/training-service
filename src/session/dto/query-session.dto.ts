import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class QuerySessionDto {
  @ApiPropertyOptional({
    description: 'Filter sessions from this date (inclusive)',
    example: '2025-01-01T00:00:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter sessions until this date (inclusive)',
    example: '2025-12-31T23:59:59Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of sessions to return',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiPropertyOptional({
    description: 'Number of sessions to skip (for pagination)',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
