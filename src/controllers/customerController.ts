import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Customer, Food, Order } from '../models';
import { customerRegisterInput, customerLoginInput } from '../validators/customer';
import { IEditCustomerProfileInput, ICartItem } from '../interfaces';
import {
  generatePasswordHash,
  validatePassword,
  generateOtp,
  requestOtp,
  generateToken
} from '../helpers/auth';

export const customerRegister = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(customerRegisterInput, req.body);

    const validationError = await validate(customerInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    const customer = await Customer.findOne({ email });

    if (customer) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const hashPassword = await generatePasswordHash(password);

    const { otp, otpExpiry } = generateOtp();

    const user = await Customer.create({
      email,
      phone,
      password: hashPassword,
      otp,
      otpExpiry,
      firstName: '',
      lastName: '',
      address: '',
      verified: false,
      latitude: 0,
      longitude: 0,
      orders: []
    });

    if (!user) {
      return res.status(400).json({ message: 'Error while creating user' });
    }

    await requestOtp(otp, phone);

    const token = generateToken({
      _id: user._id,
      email: user.email,
      verified: user.verified
    });

    return res.status(201).json({ email: user.email, verified: user.verified, token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const customerLogin = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(customerLoginInput, req.body);

    const validationError = await validate(customerInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;

    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const isMatch = await validatePassword(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = generateToken({
      _id: customer._id,
      email: customer.email,
      verified: customer.verified
    });

    return res.status(200).json({ email: customer.email, verified: customer.verified, token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const customerVerify = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const user = req.user;

    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    if (customer.otpExpiry <= new Date() || customer.otp !== parseInt(otp)) {
      return res.status(404).json({ message: 'You need to request a new OTP!' });
    }

    customer.verified = true;

    const updateUser = await customer.save();

    const token = generateToken({
      _id: updateUser._id,
      email: updateUser.email,
      verified: updateUser.verified
    });

    return res.status(200).json({
      email: updateUser.email,
      verified: updateUser.verified,
      token
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const customerRequestOtp = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    const { otp, otpExpiry } = generateOtp();
    customer.otp = otp;
    customer.otpExpiry = otpExpiry;

    await customer.save();
    await requestOtp(otp, customer.phone);

    return res.status(200).json({ message: 'OTP sent to your mobile number!' });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profile = await Customer.findById(user?._id);

    if (!profile) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const editCustomerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { firstName, lastName, address }: IEditCustomerProfileInput = req.body;

    const profile = await Customer.findById(user?._id);

    if (!profile) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id);

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist!' });
    }

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    // const cart = <ICartItem[]>req.body;
    const cart: ICartItem[] = req.body;

    let cartItems = Array();
    let netAmount = 0.0;

    const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

    foods.map(food => {
      cart.map(({ _id, unit }) => {
        if (String(food._id) === _id) {
          netAmount += (food.price * unit);
          cartItems.push({ food, unit });
        }
      })
    })

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: 'COD',
        paymentResponse: '',
        orderStatus: 'Waiting'
      })

      customer.orders.push(currentOrder);

      await customer.save();

      return res.status(200).json(currentOrder);
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const customer = await Customer.findById(user?._id).populate('orders');

    if (!customer || customer.orders.length <= 0) {
      return res.status(404).json({ message: 'Orders not found!' });
    }

    return res.status(200).json(customer.orders);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.food');

    if (!order) {
      return res.status(404).json({ message: 'Order not founds!' });
    }

    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
