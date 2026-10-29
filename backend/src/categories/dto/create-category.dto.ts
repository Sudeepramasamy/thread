import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: "Men's Collection" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'mens-collection' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Sophisticated essentials and tailored luxury for men.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
