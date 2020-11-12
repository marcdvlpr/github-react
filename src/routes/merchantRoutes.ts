import express, { Request, Response } from 'express';
import { Authenticate } from '../middleware/auth';
import { merchantLogin, getMerchantProfile } from '../controllers/merchantController';

const router = express.Router();

router.post('/login', merchantLogin);

router.get('/profile', Authenticate, getMerchantProfile);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Merchant' });
});

export default router;
