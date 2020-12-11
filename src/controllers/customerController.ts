import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerInput } from '../validators/customer';
import { generatePasswordHash } from '../helpers/auth';
import { Customer } from '../models/Customer';

export const customerRegister = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const inputErrors = await validate(customerInputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customerInputs;

    const hashPassword = await generatePasswordHash(password);

    const otp = 494949;
    const otpExpiry = new Date();

    const newUser = await Customer.create({
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

    if (!newUser) {
      return res.status(400).json({ message: 'Error while creating user' });
    }

    res.status(201).send();
  } catch (error) {
    console.log(error);
  }
};
