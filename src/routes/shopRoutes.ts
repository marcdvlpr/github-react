import express, { Request, Response } from 'express';
import {
  getFoodAvailability,
  getFoodsIn30Min,
  getOffers,
  getRestaurantById,
  getTopRestaurants,
  searchFoods
} from '../controllers/shopController';

const router = express.Router();

router.get('/:zipCode', getFoodAvailability);
router.get('/top-restaurant/:zipCode', getTopRestaurants);
router.get('/foods30min/:zipCode', getFoodsIn30Min);
router.get('/search/:zipCode', searchFoods);
router.get('/offers/:zipCode', getOffers);
router.get('/restaurant/:id', getRestaurantById);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Shop' });
});

export default router;
