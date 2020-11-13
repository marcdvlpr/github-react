import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './src/images';

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName =
      `${Date.now()}_${file.originalname.replace(/\s+|-/g, '_').toLowerCase()}`;

    cb(null, fileName);
  },
});

export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const limits = {
  fileSize: 1.5 * 1024 * 1024,
};
