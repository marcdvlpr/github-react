import express from 'express';
import { Authenticate, rateLimiter } from '../middleware';
import {
  addToCart,
  createOrder,
  createPayment,
  customerLogin,
  customerRegister,
  customerRequestOtp,
  customerVerify,
  deleteCart,
  editCustomerProfile,
  getCart,
  getCustomerProfile,
  getOrderById,
  getOrders,
  verifyOffer
} from '../controllers/customerController';

const router = express.Router();

router.post('/register', customerRegister);
router.post('/login', rateLimiter, customerLogin);

router.use(Authenticate);
router.patch('/verify', customerVerify);
router.get('/otp', customerRequestOtp);
router.get('/profile', getCustomerProfile);
router.patch('/profile', editCustomerProfile);
router.post('/create-order', createOrder);
router.get('/orders', getOrders);
router.get('/order/:id', getOrderById);
router.post('/cart', addToCart);
router.get('/cart', getCart);
router.delete('/cart', deleteCart);
router.get('/offer/verify/:id', verifyOffer);
router.post('/create-payment', createPayment);

export default router;
