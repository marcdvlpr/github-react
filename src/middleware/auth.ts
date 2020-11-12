import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/auth';

export const Authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isValid = verifyToken(req, res);

    if (!isValid) {
      return res.status(401).json({ message: 'You are not logged in!' });
    }

    return next();
  } catch (error) {
    console.error(error);
  }
};
