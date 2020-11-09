import { Request, Response } from 'express';

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
    res.json({
      name,
      foodType,
      address,
      phone,
      email,
      password,
      owner
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
