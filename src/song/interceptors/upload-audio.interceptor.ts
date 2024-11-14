import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Injectable()
export class AudioFileInterceptor extends FileInterceptor('audioFile', {
  storage: diskStorage({
    destination: './uploads/audio',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'audio/mpeg') {
      return cb(null, false);
    }
    cb(null, true);
  },
}) {}
