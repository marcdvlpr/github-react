import express, { Request, Response } from 'express';
import { Authenticate } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';
import {
  merchantLogin,
  getMerchantProfile,
  updateMerchantProfile,
  updateMerchantService,
  addFoodItem,
  getFoods,
  updateMerchantCoverImage,
  getOrders
} from '../controllers/merchantController';

const router = express.Router();

router.post('/login', merchantLogin);

router.get('/profile', Authenticate, getMerchantProfile);
router.patch('/profile', Authenticate, updateMerchantProfile);
router.patch('/coverimage', Authenticate, uploadImage.array('images', 10), updateMerchantCoverImage);
router.patch('/service', Authenticate, updateMerchantService);

router.post('/food', Authenticate, uploadImage.array('images', 10), addFoodItem);
router.get('/food', Authenticate, getFoods);

router.get('/orders', Authenticate, getOrders);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Merchant' });
});

export default router;
