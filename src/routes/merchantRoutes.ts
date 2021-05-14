import { Router } from 'express';
import { authenticate, uploadImage, rateLimiter } from '../middleware';
import {
  addFoodItem,
  addOffer,
  editOffer,
  getFoods,
  getMerchantProfile,
  getOffers,
  getOrderDetails,
  getOrders,
  merchantLogin,
  processOrder,
  updateMerchantCoverImage,
  updateMerchantProfile,
  updateMerchantService
} from '../controllers/merchantController';

const router = Router();

router.post('/login', rateLimiter, merchantLogin);

router.use(authenticate);
router.get('/profile', getMerchantProfile);
router.patch('/profile', updateMerchantProfile);
router.patch('/coverimage', uploadImage.array('images', 10), updateMerchantCoverImage);
router.patch('/service', updateMerchantService);
router.post('/food', uploadImage.array('images', 10), addFoodItem);
router.get('/food', getFoods);
router.get('/orders', getOrders);
router.get('/order/:id', getOrderDetails);
router.put('/order/:id/process', processOrder);
router.get('/offers', getOffers);
router.post('/offer', uploadImage.array('images', 10), addOffer);
router.put('/offer/:id', editOffer);

export default router;
