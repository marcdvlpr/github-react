import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';
import { Food } from '../models/Food';
import { validatePassword, generateToken } from '../helpers/auth';
import { IMerchantLoginInput, IEditMerchantInput } from '../interfaces/IMerchant';
import { ICreateFoodItemInput } from '../interfaces/IFood';

export const merchantLogin = async (req: Request, res: Response) => {
  const { email, password } = <IMerchantLoginInput>req.body;

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
  const { name, foodType, address, phone } = <IEditMerchantInput>req.body;

  const merchantField = {} as IEditMerchantInput;

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

export const updateMerchantCoverImage = async (req: Request, res: Response) => {
  try {
    const merchant = await Merchant.findById(req.user?._id);

    if (merchant !== null) {
      const files = req.files as Express.Multer.File[];
      const images = files.map((file: Express.Multer.File) => file.filename);

      merchant.coverImages.push(...images);

      const saveResult = await merchant.save();

      return res.status(200).json(saveResult);
    }

    return res.status(400).json({ message: 'Unable to update merchant profile' });
  } catch (error) {
    console.error(error);
  }
};

export const updateMerchantService = async (req: Request, res: Response) => {
  try {
    const merchant = await Merchant.findById(req.user?._id);

    if (merchant !== null) {
      merchant.serviceAvailable = !merchant.serviceAvailable;

      const saveResult = await merchant.save();
      return res.status(200).json(saveResult);
    }


    return res.status(400).json({ message: 'Unable to update merchant profile' })
  } catch (error) {
    console.error(error);
  }
};

export const addFoodItem = async (req: Request, res: Response) => {
  const { name, description, category, foodType, readyTime, price } = <ICreateFoodItemInput>req.body;

  try {
    const merchant = await Merchant.findById(req.user?._id);

    if (merchant !== null) {
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
    }

    return res.status(400).json({ message: 'Unable to update merchant profile'});
  } catch (error) {
    console.error(error);
  }
};

export const getFoods = async (req: Request, res: Response) => {
  try {
    const foods = await Food.find({ merchantId: req.user?._id });

    if (foods.length === 0) {
      return res.status(404).json({ message: 'Foods not found!' });
    }

    return res.status(200).json(foods);
  } catch (error) {
    console.error(error);
  }
};
