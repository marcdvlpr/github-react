import express, { Request, Response } from 'express';
import { Authenticate } from '../middleware/auth';
import {
  merchantLogin,
  getMerchantProfile,
  updateMerchantProfile,
  updateMerchantService,
  addFoodItem,
  getFoods
} from '../controllers/merchantController';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

router.post('/login', merchantLogin);

router.get('/profile', Authenticate, getMerchantProfile);
router.patch('/profile', Authenticate, updateMerchantProfile);
router.patch('/service', Authenticate, updateMerchantService);

router.post('/food', Authenticate, uploadImage.array('images', 10), addFoodItem);
router.get('/food', Authenticate, getFoods);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Merchant' });
});

export default router;
