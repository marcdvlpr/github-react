import { Router } from 'express';
import { uploadImage } from '../middleware';
import {
  createMerchant,
  getMerchants,
  getMerchantById,
  getTransactions,
  getTransactionById,
  verifyDeliver,
  getDelivers,
  createCategory
} from '../controllers/adminController';

const router = Router();

router.post('/merchant', createMerchant);
router.get('/merchants', getMerchants);
router.get('/merchant/:id', getMerchantById);
router.get('/transactions', getTransactions);
router.get('/transaction/:id', getTransactionById);
router.put('/deliver/verify', verifyDeliver);
router.get('/delivers', getDelivers);
router.post('/category', uploadImage.array('images', 10), createCategory);

export default router;
