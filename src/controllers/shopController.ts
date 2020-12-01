import { Request, Response } from 'express';
import { Merchant } from '../models/Merchant';
import { IFoodModel } from '../models/Food';

export const getFoodAvailability = async (req: Request, res: Response) => {
  const zipCode = req.params.zipCode;

  try {
    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .populate('foods');

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    return res.status(200).json(restaurants);
  } catch (error) {
    console.log(error);
  }
};

export const getTopRestaurants = async (req: Request, res: Response) => {
  const zipCode = req.params.zipCode;

  try {
    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .limit(10);

      if (restaurants.length === 0) {
        return res.status(404).json({ message: 'Data not found!' });
      }

      return res.status(200).json(restaurants);
  } catch (error) {
    console.log(error);
  }
};

export const getFoodsIn30Min = async (req: Request, res: Response) => {
  const zipCode = req.params.zipCode;

  try {
    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .populate('foods');

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    let foodResult: any = [];

    restaurants.map(merchant => {
      const foods = merchant.foods as [IFoodModel];

      foodResult.push(...foods.filter(food => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
  } catch (error) {
    console.log(error);
  }
};
