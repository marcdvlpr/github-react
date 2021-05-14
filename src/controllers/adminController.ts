import { Request, Response } from 'express';
import { Merchant, Transaction, Deliver, Category } from '../models';
import { generatePasswordHash } from '../helpers';
import { ICreateMerchantInput, ICreateCategoryInput } from '../interfaces';

export const createMerchant = async (req: Request, res: Response) => {
  try {
    const {
      name,
      foodType,
      address,
      postalCode,
      phone,
      email,
      password,
      owner
    }: ICreateMerchantInput = req.body;

    const existingMerchant = await Merchant.findOne({ email });

    if (existingMerchant) return res.status(400).json({ message: 'Merchant already exists!'});

    const hashPassword = await generatePasswordHash(password);

    const newMerchant = await Merchant.create({
      name,
      foodType,
      address,
      postalCode,
      phone,
      email,
      password: hashPassword,
      owner,
      serviceAvailable: false,
      images: [],
      rating: 0,
      latitude: 0,
      longitude: 0
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

    if (!merchants) return res.status(404).json({ message: 'Merchants data not available!' });

    return res.status(200).json(merchants);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getMerchantById = async (req: Request, res: Response) => {
  try {
    const merchantId = req.params.id;

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) return res.status(404).json({ message: 'Merchant data not found!' });

    return res.status(200).json(merchant);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();

    if (!transactions) return res.status(404).json({ message: 'Transactions data not available!' });

    return res.status(200).json(transactions);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) return res.status(404).json({ message: 'Transaction data not available!' });

    return res.status(200).json(transaction);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const verifyDeliver = async (req: Request, res: Response) => {
  try {
    const { deliverId, status } = req.body;

    if (!deliverId) return res.status(404).json({ message: 'Unable to verify deliver!' });

    const profile = await Deliver.findById(deliverId);

    if (!profile) return res.status(404).json({ message: 'Deliver does not exist!' });

    profile.verified = status;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getDelivers = async (req: Request, res: Response) => {
  try {
    const delivers = await Deliver.find();

    if (!delivers) return res.status(404).json({ message: 'Unable to get delivers!' });

    return res.status(200).json(delivers);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, title }: ICreateCategoryInput = req.body;

    const files = req.files as [Express.Multer.File];
    const images = files?.map((file: Express.Multer.File) => {
      return `${req.protocol}://${req.get('host')}/images/${file.filename}`;
    });

    const category = await Category.create({
      categoryId,
      title,
      images
    });

    if (!category) return res.status(400).json({ message: 'Error while creating category' });

    return res.status(201).json(category);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
