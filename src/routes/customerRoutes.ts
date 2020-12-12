import express, { Request, Response } from 'express';
import { customerRegister, customerVerify } from '../controllers/customerController';
import { Authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', customerRegister);

router.patch('/verify', Authenticate, customerVerify);

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Customer' });
});

export default router;
