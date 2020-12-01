import express, { Request, Response } from 'express';
import {
  getFoodAvailability,
  getTopRestaurants
} from '../controllers/shopController';

const router = express.Router();

router.get('/:zipCode', getFoodAvailability);
router.get('/top-restaurant/:zipCode', getTopRestaurants);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Shop' });
});

export default router;
