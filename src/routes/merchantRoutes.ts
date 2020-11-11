import express, { Request, Response } from 'express';
import { merchantLogin } from '../controllers/merchantController';

const router = express.Router();

router.post('/login', merchantLogin);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Merchant' });
});

export default router;
