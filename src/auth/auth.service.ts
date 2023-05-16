import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { BcryptService } from 'src/services/bcrypt/bcrypt.service';

import { UserDto, loginUserDto, registerUserDto, tokenDto } from 'src/dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly bcryptService: BcryptService
  ) {}

  async register(userData: registerUserDto): Promise<tokenDto> {
    try {
      const { password, ...otherData }: registerUserDto = userData;
      const hashedPassword = await this.bcryptService.hashPassword(password);
      const userInfo: registerUserDto = {
        ...otherData,
        password: hashedPassword
      };

      const user = await this.userModel.create<registerUserDto>(userInfo);

      if (!user) {
        throw new HttpException('Wrong incoming data', HttpStatus.BAD_REQUEST);
      }

      const token = await this.jwtService.signAsync(user.toJSON(), {
        secret: process.env.SECRET_KEY
      });

      return {
        token
      };
    } catch (error) {
      return error;
    }
  }

  async login(userData: loginUserDto): Promise<tokenDto> {
    try {
      const user = await this.userModel
        .findOne({ email: userData.email })
        .exec();

      if (!user) {
        throw new HttpException('Wrong incoming data', HttpStatus.BAD_REQUEST);
      }

      const passwordEquals: boolean = await this.bcryptService.compareHash(
        userData.password,
        user.password
      );

      const emailEquals: boolean = user.email === userData.email;

      if (!passwordEquals || !emailEquals) {
        throw new HttpException(
          'Wrong email or password!',
          HttpStatus.UNAUTHORIZED
        );
      }

      const token = await this.jwtService.signAsync(user.toJSON(), {
        secret: process.env.SECRET_KEY
      });

      return {
        token
      };
    } catch (error) {
      return error;
    }
  }

  async authMe(id: mongoose.Schema.Types.ObjectId): Promise<UserDto> {
    try {
      const user = await this.userModel.findOne<UserDto>({ _id: id }).exec();

      if (!user) {
        throw new HttpException(
          'You are not authorized!!!',
          HttpStatus.UNAUTHORIZED
        );
      }

      return user;
    } catch (error) {
      return error;
    }
  }
}
