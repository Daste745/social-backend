import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthRequest } from './types';
import { AuthService } from './auth.service';
import { AuthToken } from './interfaces';
import { LocalAuthGuard, JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCreatedResponse({ type: AuthToken })
  @ApiUnauthorizedResponse()
  async login(@Req() req: AuthRequest): Promise<AuthToken> {
    return this.authService.generateToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async logout(@Req() req: AuthRequest): Promise<{ message: string }> {
    return this.authService.logout(req.user);
  }
}
