import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Delivery } from '../models';
import { DeliveryRegisterInput } from '../validators/delivery';
import { generatePasswordHash, generateToken } from '../helpers/auth';

export const deliverRegister = async (req: Request, res: Response) => {
  try {
    const deliveryInputs = plainToClass(DeliveryRegisterInput, req.body);

    const validationError = await validate(deliveryInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, phone, password, firstName, lastName, address, zipCode } = deliveryInputs;

    const hasDeliver = await Delivery.findOne({ email });

    if (hasDeliver) {
      return res.status(400).json({ message: 'Deliver already exists!' });
    }

    const hashPassword = await generatePasswordHash(password);

    const deliver = await Delivery.create({
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
