import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Julian Hayes' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'julian@example.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'Wholesale inquiry' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ example: 'I would like to inquire about customized tailoring for events.' })
  @IsString()
  @IsNotEmpty({ message: 'Message content is required' })
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  message: string;
}
