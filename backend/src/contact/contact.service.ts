import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: createContactDto.name,
        email: createContactDto.email.toLowerCase().trim(),
        subject: createContactDto.subject,
        message: createContactDto.message,
      },
    });
  }

  async findAll(unreadOnly = false) {
    return this.prisma.contactMessage.findMany({
      where: unreadOnly ? { isRead: false } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      throw new NotFoundException(`Message with ID '${id}' not found`);
    }

    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
