import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter and private sale alerts' })
  subscribe(@Body() subscribeDto: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(subscribeDto);
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all newsletter subscribers (Admin)' })
  findAll() {
    return this.newsletterService.findAll();
  }
}
