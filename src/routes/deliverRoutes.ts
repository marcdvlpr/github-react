import express, { Request, Response } from 'express';
import {
  deliverRegister,
  deliverLogin,
  getDeliverProfile,
  editDeliverProfile
} from '../controllers/deliverController';
import { Authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', deliverRegister);
router.post('/login', deliverLogin);
router.get('/profile', Authenticate, getDeliverProfile);
router.patch('/profile', Authenticate, editDeliverProfile);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Deliver' });
});

export default router;
