import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';

export const createMerchant = async (req: Request, res: Response) => {
  const {
    name,
    foodType,
    address,
    phone,
    email,
    password,
    owner
  } = req.body;

  try {
    const existingMerchant = await Merchant.findOne({ email });

    if (existingMerchant) {
      return res.json({ message: 'Merchant already exists'})
    };

    const newMerchant = await Merchant.create({
      name,
      foodType,
      address,
      phone,
      email,
      password,
      owner,
      serviceAvailable: false,
      coverImages: [],
      rating: 0
    });


    res.json(newMerchant);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
