import { AuthPayload } from '../interfaces';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
  namespace Express {
    export interface Request {
      user?: AuthPayload;
    }
  }
}
