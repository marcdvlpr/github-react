import { Request, Response } from 'express';
import rateLimit, { Options } from 'express-rate-limit';

const limitHandler = (req: Request, res: Response) => {
  return res.status(429).json({
    message: 'You have exceeded 10 connection attempts, please try again after 1 hour'
  });
};

const options: Options = {
  windowMs: 60 * 60 * 1000,
  max: 10,
  handler: limitHandler,
};

export const rateLimiter = rateLimit(options);
