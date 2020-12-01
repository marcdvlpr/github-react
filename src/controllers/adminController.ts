import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';
import { generatePasswordHash } from '../helpers/auth';
import { ICreateMerchantInput } from '../interfaces/IMerchant';

export const createMerchant = async (req: Request, res: Response) => {
  const {
    name,
    foodType,
    address,
    zipCode,
    phone,
    email,
    password,
    owner
  }: ICreateMerchantInput = req.body;

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
      zipCode,
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

export const getMerchants = async (req: Request, res: Response) => {
  try {
    const merchants = await Merchant.find();

    if (merchants === null) {
      return res.status(404).json({ message: 'Merchants data not available' });
    }

    res.status(200).json(merchants);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

export const getMerchantByID = async (req: Request, res: Response) => {
  const merchantID = req.params.id;

  try {
    const merchant = await Merchant.findById(merchantID);

    if (merchant === null) {
      return res.status(404).json({ message: 'Merchant data not found' });
    }

    res.status(200).json(merchant);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).send('Server Error');
  }
};
