import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Customer } from '../models/Customer';
import { Food } from '../models/Food';
import { customerRegisterInput, customerLoginInput } from '../validators/customer';
import { IEditCustomerProfileInput } from '../interfaces/ICustomer';
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
      longitude: 0
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
    console.log(error);
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
    console.log(error);
  }
};

export const customerVerify = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const customer = req.user;

    if (!customer) {
      return res.status(400).json({ message: 'You are not logged in!' });
    }

    const user = await Customer.findById(customer._id);

    if (user && user.otpExpiry <= new Date()) {
      return res.status(400).json({ message: 'You need to request a new OTP!' });
    }

    if (user && user.otp === parseInt(otp) && user.otpExpiry >= new Date()) {
      user.verified = true;

      const updateUser = await user.save();

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
    }
  } catch (error) {
    console.log(error);
  }
};

export const customerRequestOtp = async (req: Request, res: Response) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(400).json({ message: 'You are not logged in!' });
    }

    const user = await Customer.findById(customer._id);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist!' });
    }

    const { otp, otpExpiry } = generateOtp();
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await requestOtp(otp, user.phone);

    return res.status(200).json({ message: 'OTP sent to your mobile number!' });
  } catch (error) {
    console.log(error);
  }
};

export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(404).json({ message: 'You are not logged in!' });
    }

    const profile = await Customer.findById(customer._id);

    if (!profile) {
      return res.status(400).json({ message: 'User does not exist!' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
  }
};

export const editCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customer = req.user;
    const { firstName, lastName, address }: IEditCustomerProfileInput = req.body;

    if (!customer) {
      return res.status(404).json({ message: 'You are not logged in!' });
    }

    const profile = await Customer.findById(customer._id);

    if (!profile) {
      return res.status(400).json({ message: 'User does not exist!' });
    }

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const customer = req.user;

    if (!customer) {
      return res.status(404).json({ message: 'You are not logged in!' });
    }

    const profile = await Customer.findById(customer._id);

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const cart = req.body;

    let cartItems = Array();
    let netAmount = 0.0;

    const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

    foods.map(food => {
      cart.map(({ _id, unit }) => {
        if (food._id === _id) {
          netAmount += (food.price * unit);
          cartItems.push({ food, unit });
        }
      })
    })

  } catch (error) {
    console.log(error);
  }
};
