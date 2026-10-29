import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category ID or category slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search term for name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by size (e.g. S, M, L)' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: 'Filter by color name' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Sort option: featured, newest, price_asc, price_desc', default: 'featured' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 12;

  @ApiPropertyOptional({ description: 'Filter active only (defaults to true for public)' })
  @IsOptional()
  isActive?: string | boolean;
}
