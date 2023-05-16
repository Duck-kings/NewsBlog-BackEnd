import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { UserDto, loginUserDto, registerUserDto, tokenDto } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: registerUserDto): Promise<tokenDto> {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: loginUserDto): Promise<tokenDto> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  authMe(@Req() req: Request) {
    const { _id } = req.user as UserDto;
    return this.authService.authMe(_id);
  }
}
