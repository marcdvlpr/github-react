import express, { Request, Response } from 'express';
import { createMerchant, getMerchants } from '../controllers/adminController';

const router = express.Router();

router.post('/merchant', createMerchant);
router.get('/merchants', getMerchants);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Admin' });
});

export default router;
