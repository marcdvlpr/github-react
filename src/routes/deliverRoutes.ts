import express, { Request, Response } from 'express';
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
router.get('/profile', Authenticate, getDeliverProfile);
router.patch('/profile', Authenticate, editDeliverProfile);
router.patch('/update-status', Authenticate, updateDeliverStatus)

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Deliver' });
});

export default router;
