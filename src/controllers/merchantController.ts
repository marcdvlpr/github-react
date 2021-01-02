import { Request, Response } from 'express';
import { Merchant, Food } from '../models';
import { validatePassword, generateToken } from '../helpers/auth';
import { IMerchantLoginInput, IEditMerchantInput, ICreateFoodItemInput } from '../interfaces';

export const merchantLogin = async (req: Request, res: Response) => {
  try {
    const { email, password }: IMerchantLoginInput = req.body;
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

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getMerchantProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const merchant = await Merchant.findById(user?._id);

    return res.status(200).json(merchant);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const updateMerchantProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { name, foodType, address, phone }: IEditMerchantInput = req.body;

    const merchantField = {} as IEditMerchantInput;

    if (name) merchantField.name = name;
    if (foodType) merchantField.foodType = foodType;
    if (address) merchantField.address = address;
    if (phone) merchantField.phone = phone;

    const updateMerchant = await Merchant.findByIdAndUpdate(
      user?._id,
      { $set: merchantField },
      { new: true, upsert: true }
    );

    return res.status(200).json(updateMerchant);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const updateMerchantCoverImage = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const merchant = await Merchant.findById(user?._id);

    if (!merchant) {
      return res.status(400).json({ message: 'Unable to update merchant profile!' });
    }

    const files = req.files as Express.Multer.File[];
    const images = files.map((file: Express.Multer.File) => file.filename);

    merchant.coverImages.push(...images);

    const saveResult = await merchant.save();

    return res.status(200).json(saveResult);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const updateMerchantService = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const merchant = await Merchant.findById(user?._id);

    if (!merchant) {
      return res.status(400).json({ message: 'Unable to update merchant profile!' });
    }

    merchant.serviceAvailable = !merchant.serviceAvailable;

    const saveResult = await merchant.save();

    return res.status(200).json(saveResult);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const addFoodItem = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { name, description, category, foodType, readyTime, price }: ICreateFoodItemInput = req.body;

    const merchant = await Merchant.findById(user?._id);

    if (!merchant) {
      return res.status(400).json({ message: 'Unable to update merchant profile!'});
    }

    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);

    const foodItem = await Food.create({
      merchantId: merchant._id,
      name,
      description,
      category,
      foodType,
      readyTime,
      price,
      rating: 0,
      images
    })

    merchant.foods.push(foodItem);

    const merchantProfile = await merchant.save();

    return res.status(201).json(merchantProfile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getFoods = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const foods = await Food.find({ merchantId: user?._id });

    if (foods.length === 0) {
      return res.status(404).json({ message: 'Foods not found!' });
    }

    return res.status(200).json(foods);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
