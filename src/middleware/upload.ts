import multer from 'multer';

const imageStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, 'images');
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

export const uploadImage = multer({ storage: imageStorage }).array('images', 10);
