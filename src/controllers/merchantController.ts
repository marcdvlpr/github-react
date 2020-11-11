import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';

export const merchantLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const merchant = await Merchant.findOne({ email }).select('+password');

    if (!merchant) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const isMatch = false;

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    res.json({ merchant });
  } catch (error) {
    console.error(error);
  }
};
