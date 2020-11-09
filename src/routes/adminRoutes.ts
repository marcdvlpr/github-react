import express, { Request, Response } from 'express';
import { createMerchant } from '../controllers/adminController';

const router = express.Router();

router.post('/vendor', createMerchant);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Admin' });
});

export default router;
