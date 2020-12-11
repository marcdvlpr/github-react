import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Customer } from '../models/Customer';
import { CreateCustomerInput } from '../validators/customer';
import { generatePasswordHash, generateOtp, requestOtp, generateToken } from '../helpers/auth';

export const customerRegister = async (req: Request, res: Response) => {
  try {
    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const inputErrors = await validate(customerInputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customerInputs;

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
