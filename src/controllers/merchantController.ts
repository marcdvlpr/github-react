import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';
import { validatePassword, generateToken } from '../helpers/auth';

export const merchantLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const merchant = await Merchant.findOne({ email }).select('+password');

    if (!merchant) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const isMatch = await validatePassword(password, merchant.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const payload = {
      _id: merchant._id,
      email: merchant.email,
      name: merchant.name
    }

    const token = generateToken(payload);

    res.json({ token });
  } catch (error) {
    console.error(error);
  }
};

export const getMerchantProfile = async (req: Request, res: Response) => {
  try {
    const merchant = await Merchant.findById(req.user?._id);

    return res.json(merchant);
  } catch (error) {
    console.error(error);
  }
};

export const updateMerchantProfile = async (req: Request, res: Response) => {
  const { name, foodType, address, phone } = req.body;

  const merchantField = { name, foodType, address, phone };

  if (name) merchantField.name = name;
  if (foodType) merchantField.foodType = foodType;
  if (address) merchantField.address = address;
  if (phone) merchantField.phone = phone;

  try {
    const updateMerchant = await Merchant.findByIdAndUpdate(
      req.user?._id,
      { $set: merchantField },
      { new: true, upsert: true }
    );

    return res.status(200).json(updateMerchant);
  } catch (error) {
    console.error(error);
  }
};
