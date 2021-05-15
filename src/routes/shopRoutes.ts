import { Router } from 'express';
import {
  getFoodsIn30Min,
  getOffers,
  getRestaurantById,
  getTopRestaurants,
  foodSearch,
  getCategories
} from '../controllers/shopController';

const router = Router();

router.get('/top-restaurants/:postalCode', getTopRestaurants);
router.get('/foods30min/:postalCode', getFoodsIn30Min);
router.get('/search/:postalCode', foodSearch);
router.get('/offers/:postalCode', getOffers);
router.get('/restaurant/:id', getRestaurantById);
router.get('/categories', getCategories);

export default router;
