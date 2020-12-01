import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';

export const getFoodAvailability = async (req: Request, res: Response) => {
  const zipCode = req.params.zipCode;

  try {
    const foods = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .populate('foods');

    if (foods.length === 0) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    return res.status(200).json(foods);
  } catch (error) {
    console.log(error);
  }
};
