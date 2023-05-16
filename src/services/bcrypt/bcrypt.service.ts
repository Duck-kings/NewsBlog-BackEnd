import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds: number = 10;

  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);

      const hashedPassword = await bcrypt.hash(password, salt);

      if (!hashedPassword) {
        throw new HttpException(
          'Something went wrong try later...',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return hashedPassword;
    } catch (error) {
      return error;
    }
  }

  async compareHash(password: string, hash: string) {
    try {
      const isEqual = await bcrypt.compare(password, hash);

      return isEqual;
    } catch (error) {
      return error;
    }
  }
}
