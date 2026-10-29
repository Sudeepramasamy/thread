import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'System health check and database connectivity verification' })
  async check() {
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      service: 'THREAD & CO. API',
      database: dbStatus,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
