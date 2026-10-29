import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    description: 'New status for the order: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED',
  })
  @IsEnum(OrderStatus, { message: 'Invalid order status transition' })
  @IsNotEmpty()
  status: OrderStatus;
}
