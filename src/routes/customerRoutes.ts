import express, { Request, Response } from 'express';
import { customerRegister } from '../controllers/customerController';

const router = express.Router();

router.post('/register', customerRegister);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Customer' });
});

export default router;
