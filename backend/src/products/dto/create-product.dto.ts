import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Front view of coat' })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

export class CreateProductVariantDto {
  @ApiProperty({ example: 'M' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 'Onyx Black' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiPropertyOptional({ example: '#111112' })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiProperty({ example: 'COAT-BLK-M' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  additionalPrice?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Tailored Cashmere Overcoat' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'tailored-cashmere-overcoat' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Premium tailored coat made from 100% cashmere...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 450.00 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 380.00 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'category-uuid-or-id' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ type: [CreateProductImageDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({ type: [CreateProductVariantDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
