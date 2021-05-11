import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Deliver } from '../models';
import {
  DeliverRegisterInput,
  DeliverLoginInput,
  EditDeliverProfileInput
} from '../validators/deliver';
import { generatePasswordHash, generateToken, validatePassword } from '../helpers/auth';

export const deliverRegister = async (req: Request, res: Response) => {
  try {
    const deliverInputs = plainToClass(DeliverRegisterInput, req.body);

    const validationError = await validate(deliverInputs, { validationError: { target: true } });

    if (validationError.length > 0) return res.status(400).json(validationError);

    const { email, phone, password, firstName, lastName, address, postalCode } = deliverInputs;

    const hasDeliver = await Deliver.findOne({ email });

    if (hasDeliver) return res.status(400).json({ message: 'Deliver already exists!' });

    const hashPassword = await generatePasswordHash(password);

    const deliver = await Deliver.create({
      email,
      phone,
      password: hashPassword,
      firstName,
      lastName,
      address,
      postalCode,
      verified: false,
      latitude: 0,
      longitude: 0
    });

    if (!deliver) return res.status(400).json({ message: 'Error while creating deliver' });

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

export const deliverLogin = async (req: Request, res: Response) => {
  try {
    const deliverInputs = plainToClass(DeliverLoginInput, req.body);

    const validationError = await validate(deliverInputs, { validationError: { target: true } });

    if (validationError.length > 0) return res.status(400).json(validationError);

    const { email, password } = deliverInputs;

    const deliver = await Deliver.findOne({ email }).select('+password');

    if (!deliver) return res.status(401).json({ message: 'Incorrect email or password' });

    const isMatch = await validatePassword(password, deliver.password);

    if (!isMatch) return res.status(401).json({ message: 'Incorrect email or password' });

    const token = generateToken({
      _id: deliver._id,
      email: deliver.email,
      verified: deliver.verified
    });

    return res.status(200).json({ email: deliver.email, verified: deliver.verified, token });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const getDeliverProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profile = await Deliver.findById(user?._id);

    if (!profile) return res.status(404).json({ message: 'Deliver does not exist!' });

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const editDeliverProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const deliverInputs = plainToClass(EditDeliverProfileInput, req.body);

    const validationError = await validate(deliverInputs, { validationError: { target: true } });

    if (validationError.length > 0) return res.status(400).json(validationError);

    const { firstName, lastName, address } = deliverInputs;

    const profile = await Deliver.findById(user?._id);

    if (!profile) return res.status(404).json({ message: 'Deliver does not exist!' });

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

export const updateDeliverStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { latitude, longitude } = req.body;

    const profile = await Deliver.findById(user?._id);

    if (!profile) return res.status(404).json({ message: 'Deliver does not exist!' });

    if (latitude && longitude) {
      profile.latitude = latitude;
      profile.longitude = longitude;
    }

    profile.isAvailable = !profile.isAvailable;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
