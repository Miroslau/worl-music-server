import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as path from 'path';

import * as fs from 'fs';

import * as uuid from 'uuid';

import { FileType } from '../enums/file-type';

@Injectable()
export class FileService {
  createFile(type: FileType, file, host): string {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuid.v4()}.${fileExtension}`;
      const filePath = path.resolve(__dirname, '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return `${host}/${type}/${fileName}`;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(file: string) {
    try {
      const fileExtension = file.split('/');
      const fileType = fileExtension[1];
      const fileName = fileExtension[2];

      const filePath = path.resolve(__dirname, '..', 'static', fileType);

      fs.unlinkSync(path.resolve(filePath, fileName));
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
