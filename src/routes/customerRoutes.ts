import express, { Request, Response } from 'express';
import {
  customerRegister,
  customerLogin,
  customerVerify,
  customerRequestOtp,
  getCustomerProfile,
  editCustomerProfile,
  createOrder,
  getOrders,
  getOrderById,
  addToCart,
  getCart,
  deleteCart
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
router.get('/orders', Authenticate, getOrders);
router.get('/order/:id', Authenticate, getOrderById);

router.post('/cart', Authenticate, addToCart);
router.get('/cart', Authenticate, getCart);
router.delete('/cart', Authenticate, deleteCart);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Customer' });
});

export default router;
