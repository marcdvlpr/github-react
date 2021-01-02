import { Request, Response } from 'express';
import { Merchant } from '../models';
import { generatePasswordHash } from '../helpers/auth';
import { ICreateMerchantInput } from '../interfaces';

export const createMerchant = async (req: Request, res: Response) => {
  try {
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

    const existingMerchant = await Merchant.findOne({ email });

    if (existingMerchant) {
      return res.status(400).json({ message: 'Merchant already exists!'})
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

    return res.status(201).json(newMerchant);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getMerchants = async (req: Request, res: Response) => {
  try {
    const merchants = await Merchant.find();

    if (!merchants) {
      return res.status(404).json({ message: 'Merchants data not available!' });
    }

    return res.status(200).json(merchants);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getMerchantByID = async (req: Request, res: Response) => {
  try {
    const merchantID = req.params.id;
    const merchant = await Merchant.findById(merchantID);

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant data not found!' });
    }

    return res.status(200).json(merchant);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
