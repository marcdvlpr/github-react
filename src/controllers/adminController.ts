import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';
import { generatePasswordHash } from '../helpers/auth';

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
      return res.status(400).json({ message: 'Merchant already exists'})
    };

    const hashPassword = await generatePasswordHash(password);

    const newMerchant = await Merchant.create({
      name,
      foodType,
      address,
      phone,
      email,
      password: hashPassword,
      owner,
      serviceAvailable: false,
      coverImages: [],
      rating: 0
    });


    res.status(201).json(newMerchant);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
