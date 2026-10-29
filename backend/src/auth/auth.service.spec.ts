import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct password', async () => {
    const hashedPassword = await bcrypt.hash('Secret123!', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'uuid-1',
      email: 'admin@threadandco.com',
      passwordHash: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await service.validateUser('admin@threadandco.com', 'Secret123!');
    expect(result).toBeDefined();
    expect(result?.email).toBe('admin@threadandco.com');
  });

  it('should reject invalid password', async () => {
    const hashedPassword = await bcrypt.hash('Secret123!', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'uuid-1',
      email: 'admin@threadandco.com',
      passwordHash: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await service.validateUser('admin@threadandco.com', 'WrongPassword');
    expect(result).toBeNull();
  });

  it('should throw UnauthorizedException on admin login for non-admin user', async () => {
    const hashedPassword = await bcrypt.hash('Secret123!', 10);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'uuid-2',
      email: 'customer@example.com',
      passwordHash: hashedPassword,
      name: 'Customer',
      role: Role.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(
      service.adminLogin({ email: 'customer@example.com', password: 'Secret123!' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
