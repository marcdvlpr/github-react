import { Router } from 'express';
import {
  createMerchant,
  getMerchants,
  getMerchantById,
  getTransactions,
  getTransactionById,
  verifyDeliver,
  getDelivers
} from '../controllers/adminController';

const router = Router();

router.post('/merchant', createMerchant);
router.get('/merchants', getMerchants);
router.get('/merchant/:id', getMerchantById);
router.get('/transactions', getTransactions);
router.get('/transaction/:id', getTransactionById);
router.put('/deliver/verify', verifyDeliver);
router.get('/delivers', getDelivers);

export default router;
