import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ example: 'variant-uuid' })
  @IsString()
  @IsOptional()
  variantId?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Victoria Sterling' })
  @IsString()
  @IsNotEmpty({ message: 'Customer name is required' })
  customerName: string;

  @ApiProperty({ example: 'victoria.sterling@example.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+1 (555) 345-6789' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  customerPhone: string;

  @ApiProperty({ example: '450 Lexington Avenue, Penthouse B' })
  @IsString()
  @IsNotEmpty({ message: 'Shipping street address is required' })
  shippingAddress: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  shippingCity: string;

  @ApiProperty({ example: '10017' })
  @IsString()
  @IsNotEmpty({ message: 'Postal/Zip code is required' })
  shippingPostalCode: string;

  @ApiPropertyOptional({ example: 'United States' })
  @IsString()
  @IsOptional()
  shippingCountry?: string;

  @ApiPropertyOptional({ example: 'Please leave package at the front desk' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'idem-uuid-984274982' })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
