import express from 'express';
import { Authenticate, rateLimiter } from '../middleware';
import {
  deliverRegister,
  deliverLogin,
  getDeliverProfile,
  editDeliverProfile,
  updateDeliverStatus
} from '../controllers/deliverController';

const router = express.Router();

router.post('/register', deliverRegister);
router.post('/login', rateLimiter, deliverLogin);

router.use(Authenticate);
router.get('/profile', getDeliverProfile);
router.patch('/profile', editDeliverProfile);
router.patch('/update-status', updateDeliverStatus);

export default router;
