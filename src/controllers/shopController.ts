import { Request, Response } from 'express';
import { Merchant, IFoodModel } from '../models';

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

export const searchFoods = async (req: Request, res: Response) => {
  const zipCode = req.params.zipCode;

  try {
    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .populate('foods');

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    let foodResult: any = [];

    restaurants.map(item => foodResult.push(...item.foods));

    return res.status(200).json(foodResult);
  } catch (error) {
    console.log(error);
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const restaurant = await Merchant.findById(id).populate('foods');

    if (!restaurant) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
  }
};
