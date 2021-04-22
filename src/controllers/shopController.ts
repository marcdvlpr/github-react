import { Request, Response } from 'express';
import { Merchant, IFoodModel, Offer } from '../models';

export const getFoodAvailability = async (req: Request, res: Response) => {
  try {
    const zipCode = req.params.zipCode;

    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .populate('foods');

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    return res.status(200).json(restaurants);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getTopRestaurants = async (req: Request, res: Response) => {
  try {
    const zipCode = req.params.zipCode;

    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .limit(10);

      if (restaurants.length === 0) {
        return res.status(404).json({ message: 'Data not found!' });
      }

      return res.status(200).json(restaurants);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getFoodsIn30Min = async (req: Request, res: Response) => {
  try {
    const zipCode = req.params.zipCode;

    const restaurants = await Merchant
      .find({ zipCode, serviceAvailable: true })
      .sort([['rating', 'descending']])
      .populate('foods');

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    let foodResult: any = [];

    restaurants.map(merchant => {
      const foods = merchant.foods as IFoodModel[];

      foodResult.push(...foods.filter(food => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const searchFoods = async (req: Request, res: Response) => {
  try {
    const zipCode = req.params.zipCode;

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
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const restaurant = await Merchant.findById(id).populate('foods');

    if (!restaurant) {
      return res.status(404).json({ message: 'Data not found!' });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getOffers = async (req: Request, res: Response) => {
  try {
    const zipCode = req.params.zipCode;

    const offers = await Offer.find({ zipCode, isActive: true });

    if (!offers) {
      return res.status(404).json({ message: 'Offers not found!' });
    }

    return res.status(200).json(offers);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
