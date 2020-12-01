import express, { Request, Response } from 'express';
import { getFoodAvailability } from '../controllers/shopController';

const router = express.Router();

router.get('/:zipcode', getFoodAvailability);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Shop' });
});

export default router;
