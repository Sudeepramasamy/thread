import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TrackOrderDto {
  @ApiProperty({ example: 'TC-2026-8812' })
  @IsString()
  @IsNotEmpty({ message: 'Order reference number is required' })
  orderNumber: string;

  @ApiProperty({ example: 'eleanor.vance@example.com' })
  @IsEmail({}, { message: 'Customer email is required for secure verification' })
  @IsNotEmpty()
  email: string;
}
