import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import mongoose from 'mongoose';
import * as path from 'path';

@Injectable()
export class FileService {
  createPath(
    file: Express.Multer.File,
    userId: mongoose.Schema.Types.ObjectId
  ): string {
    const staticFiles = 'upload/img';
    const destination = `${process.cwd()}/${staticFiles}`;
    const fileName = userId + '-' + file.originalname;

    if (!fs.existsSync(path.join(destination, fileName))) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const pathToFile = `img/${fileName}`;

    fs.writeFileSync(path.join(destination, fileName), file.buffer);

    return pathToFile;
  }

  deleteFile(fileName: string) {
    const staticFiles = 'upload/img';
    const destination = `${process.cwd()}/${staticFiles}`;

    if (!fs.existsSync(path.join(destination, fileName))) {
      throw new HttpException('File not exist', HttpStatus.CONFLICT);
    }

    fs.unlinkSync(path.join(destination, fileName));
  }
}
