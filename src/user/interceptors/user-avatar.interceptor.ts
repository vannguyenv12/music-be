import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Injectable()
export class UserProfilePictureInterceptor extends FileInterceptor(
  'profilePicture',
  {
    storage: diskStorage({
      destination: './uploads/profile-pictures', // Thư mục lưu trữ ảnh đại diện
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Lấy phần mở rộng của file
        cb(null, `user-${uniqueSuffix}${ext}`); // Đặt tên file
      },
    }),
    fileFilter: (req, file, cb) => {
      // Chỉ chấp nhận file ảnh JPEG, PNG
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        return cb(null, false); // Từ chối nếu không phải định dạng ảnh hợp lệ
      }
      cb(null, true);
    },
  },
) {}
