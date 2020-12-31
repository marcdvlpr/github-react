import express, { Request, Response } from 'express';
import {
  customerRegister,
  customerLogin,
  customerVerify,
  customerRequestOtp,
  getCustomerProfile,
  editCustomerProfile,
  createOrder
} from '../controllers/customerController';
import { Authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', customerRegister);
router.post('/login', customerLogin);

router.patch('/verify', Authenticate, customerVerify);
router.get('/otp', Authenticate, customerRequestOtp);

router.get('/profile', Authenticate, getCustomerProfile);
router.patch('/profile', Authenticate, editCustomerProfile);

router.post('/create-order', Authenticate, createOrder);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Customer' });
});

export default router;
