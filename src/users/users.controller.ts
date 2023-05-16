import { Body, Controller, Put, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from './users.service';

import { UserDto } from 'src/dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('update')
  updateUser(@Body() userData: UserDto): Promise<UserDto> {
    return this.userService.updateUser(userData);
  }
}
