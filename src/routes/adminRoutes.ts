import express, { Request, Response } from 'express';
import {
  createMerchant,
  getMerchants,
  getMerchantById,
  getTransactions,
  getTransactionById,
  verifyDeliver
} from '../controllers/adminController';

const router = express.Router();

router.post('/merchant', createMerchant);
router.get('/merchants', getMerchants);
router.get('/merchant/:id', getMerchantById);

router.get('/transactions', getTransactions);
router.get('/transaction/:id', getTransactionById);

router.put('/deliver/verify', verifyDeliver);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Admin' });
});

export default router;
