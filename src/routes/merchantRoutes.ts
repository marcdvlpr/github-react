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

const router = express.Router();

router.post('/login', merchantLogin);

router.get('/profile', Authenticate, getMerchantProfile);
router.patch('/profile', Authenticate, updateMerchantProfile);
router.patch('/service', Authenticate, updateMerchantService);

router.post('/food', Authenticate, addFoodItem);
router.get('/food', Authenticate, getFoods);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Merchant' });
});

export default router;
