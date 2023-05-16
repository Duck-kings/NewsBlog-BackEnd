import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';

import { JwtStrategy } from 'src/strategies/jwt.strategy';

import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: '24h' }
      })
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BcryptService]
})
export class AuthModule {}
