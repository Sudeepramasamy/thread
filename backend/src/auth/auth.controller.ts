import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login endpoint' })
  @ApiResponse({ status: 200, description: 'Admin successfully authenticated and token returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or non-admin role' })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer/General login endpoint' })
  @ApiResponse({ status: 200, description: 'User authenticated and token returned' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated user profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}
