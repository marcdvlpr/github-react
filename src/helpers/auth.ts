import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Twilio } from 'twilio';
import { AuthPayload } from '../interfaces/IAuth';
import {
  JWT_SECRET,
  TOKEN_LIFE,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} from '../config';

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

export const verifyToken = (req: Request, res: Response) => {
  try {
    const token = req.get('Authorization');

    if (!token) return false;

    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET) as AuthPayload;

    req.user = decoded;
    return true;
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  const otpExpiry = new Date();
  otpExpiry.setTime(new Date().getTime() + (30 * 60 * 1000));

  return { otp, otpExpiry };
};

export const requestOtp = async (otp: number, phoneNumber: string) => {
  try {
    const accountSid = TWILIO_ACCOUNT_SID;
    const authToken = TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      const client = new Twilio(accountSid, authToken);

      const response = await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber,
        body: `Your OTP verification code is: ${otp}`
      });

      return response;
    }
  } catch (error) {
    console.log(error);
  }
};
