import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Deliver } from '../models';
import { DeliverRegisterInput } from '../validators/deliver';
import { generatePasswordHash, generateToken } from '../helpers/auth';

export const deliverRegister = async (req: Request, res: Response) => {
  try {
    const deliverInputs = plainToClass(DeliverRegisterInput, req.body);

    const validationError = await validate(deliverInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, phone, password, firstName, lastName, address, zipCode } = deliverInputs;

    const hasDeliver = await Deliver.findOne({ email });

    if (hasDeliver) {
      return res.status(400).json({ message: 'Deliver already exists!' });
    }

    const hashPassword = await generatePasswordHash(password);

    const deliver = await Deliver.create({
      email,
      phone,
      password: hashPassword,
      firstName,
      lastName,
      address,
      zipCode,
      verified: false,
      latitude: 0,
      longitude: 0
    });

    if (!deliver) {
      return res.status(400).json({ message: 'Error while creating user' });
    }

    const token = generateToken({
      _id: deliver._id,
      email: deliver.email,
      verified: deliver.verified
    });

    return res.status(201).json({ email: deliver.email, verified: deliver.verified, token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
