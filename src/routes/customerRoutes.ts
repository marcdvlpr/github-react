import { Router } from 'express';
import { authenticate, rateLimiter } from '../middleware';
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
  cancelOrder,
  addToCart,
  getCart,
  deleteCart,
  verifyOffer,
  createPayment
} from '../controllers/customerController';

const router = Router();

router.post('/register', customerRegister);
router.post('/login', rateLimiter, customerLogin);

router.use(authenticate);
router.patch('/verify', customerVerify);
router.get('/otp', customerRequestOtp);
router.get('/profile', getCustomerProfile);
router.patch('/profile', editCustomerProfile);
router.post('/create-order', createOrder);
router.get('/orders', getOrders);
router.get('/order/:id', getOrderById);
router.delete('/order/:id', cancelOrder);
router.post('/cart', addToCart);
router.get('/cart', getCart);
router.delete('/cart', deleteCart);
router.get('/offer/verify/:id', verifyOffer);
router.post('/create-payment', createPayment);

export default router;
