import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeNewsletterDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  email: string;
}
