import express from 'express';
import {
  getFoodAvailability,
  getFoodsIn30Min,
  getOffers,
  getRestaurantById,
  getTopRestaurants,
  foodSearch
} from '../controllers/shopController';

const router = express.Router();

router.get('/:postalCode', getFoodAvailability);
router.get('/top-restaurants/:postalCode', getTopRestaurants);
router.get('/foods30min/:postalCode', getFoodsIn30Min);
router.get('/search/:postalCode', foodSearch);
router.get('/offers/:postalCode', getOffers);
router.get('/restaurant/:id', getRestaurantById);

export default router;
