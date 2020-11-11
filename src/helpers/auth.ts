import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthPayload } from '../interfaces/IAuth';
import { JWT_SECRET, TOKEN_LIFE } from '../config';

export const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (password: string, passwordHash: string) => {
  return await bcrypt.compare(password, passwordHash);
};

export const generateToken = (payload: AuthPayload) => {
  const signOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: TOKEN_LIFE,
  };
  return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const verifyToken = (req: Request) => {
  const token = req.get('Authorization');

  if (!token) {
    return false;
  }

  const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET) as AuthPayload;

  req.user = decoded;
  return true;
};
