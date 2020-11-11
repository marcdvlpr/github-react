import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/login');

router.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello from Merchant' });
});

export default router;
