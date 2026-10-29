import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              count: jest.fn().mockResolvedValue(1),
              findMany: jest.fn().mockResolvedValue([
                {
                  id: 'prod-1',
                  name: 'Wool Overcoat',
                  slug: 'wool-overcoat',
                  price: 450,
                  stock: 20,
                  isActive: true,
                },
              ]),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated products list', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
  });

  it('should throw NotFoundException when product does not exist', async () => {
    jest.spyOn(prisma.product, 'findFirst').mockResolvedValue(null);
    await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
  });
});
