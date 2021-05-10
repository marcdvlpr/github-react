import express from 'express';
import {
  deliverRegister,
  deliverLogin,
  getDeliverProfile,
  editDeliverProfile,
  updateDeliverStatus
} from '../controllers/deliverController';
import { Authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', deliverRegister);
router.post('/login', deliverLogin);

router.use(Authenticate);
router.get('/profile', getDeliverProfile);
router.patch('/profile', editDeliverProfile);
router.patch('/update-status', updateDeliverStatus);

export default router;
