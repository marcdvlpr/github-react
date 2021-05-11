import express from 'express';
import {
  getFoodAvailability,
  getFoodsIn30Min,
  getOffers,
  getRestaurantById,
  getTopRestaurants,
  searchFoods
} from '../controllers/shopController';

const router = express.Router();

router.get('/:postalCode', getFoodAvailability);
router.get('/top-restaurant/:postalCode', getTopRestaurants);
router.get('/foods30min/:postalCode', getFoodsIn30Min);
router.get('/search/:postalCode', searchFoods);
router.get('/offers/:postalCode', getOffers);
router.get('/restaurant/:id', getRestaurantById);

export default router;
