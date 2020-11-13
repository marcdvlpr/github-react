import multer from 'multer';
import { storage, fileFilter, limits } from '../helpers/upload';

export const uploadImage = multer({ storage, fileFilter, limits });
