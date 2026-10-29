import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException when order has no items', async () => {
    await expect(
      service.create({
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        shippingAddress: '123 Test St',
        shippingCity: 'City',
        shippingPostalCode: '12345',
        items: [],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
