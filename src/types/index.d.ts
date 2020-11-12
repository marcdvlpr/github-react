import { AuthPayload } from '../interfaces/IAuth';

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
