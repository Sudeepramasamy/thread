import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(subscribeNewsletterDto: SubscribeNewsletterDto) {
    const email = subscribeNewsletterDto.email.toLowerCase().trim();

    const existing = await this.prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isActive) {
        await this.prisma.newsletterSubscription.update({
          where: { email },
          data: { isActive: true },
        });
      }
      return {
        success: true,
        message: 'Welcome back! Your subscription is active.',
      };
    }

    await this.prisma.newsletterSubscription.create({
      data: { email },
    });

    return {
      success: true,
      message: 'Thank you for subscribing to THREAD & CO. editorials.',
    };
  }

  async findAll() {
    return this.prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
