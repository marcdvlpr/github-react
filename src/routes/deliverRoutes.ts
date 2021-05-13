import { Router } from 'express';
import { authenticate, rateLimiter } from '../middleware';
import {
  deliverRegister,
  deliverLogin,
  getDeliverProfile,
  editDeliverProfile,
  updateDeliverStatus
} from '../controllers/deliverController';

const router = Router();

router.post('/register', deliverRegister);
router.post('/login', rateLimiter, deliverLogin);

router.use(authenticate);
router.get('/profile', getDeliverProfile);
router.patch('/profile', editDeliverProfile);
router.patch('/update-status', updateDeliverStatus);

export default router;
