import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IMerchantPayload } from '../interfaces/IMerchant';
import { JWT_SECRET } from '../config';

export const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (password: string, passwordHash: string) => {
  return await bcrypt.compare(password, passwordHash);
};

export const generateToken = (payload: IMerchantPayload) => {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '24h' });
};
