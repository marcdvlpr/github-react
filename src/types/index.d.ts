import { AuthPayload } from "../interfaces/IAuth";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: boolean;
      JWT_SECRET: string;
    }
  }
  namespace Express {
    export interface Request {
      user?: AuthPayload;
    }
  }
}
