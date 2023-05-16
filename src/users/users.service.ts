import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDto } from 'src/dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUser(userData: UserDto): Promise<UserDto> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate<UserDto>(userData._id, userData, {
          new: true
        })
        .populate('articles')
        .exec();

      if (!updatedUser) {
        throw new HttpException('Wrong incoming data', HttpStatus.BAD_REQUEST);
      }

      return updatedUser;
    } catch (error) {
      return error;
    }
  }
}
