import * as express from 'express';
import { JwtPayload } from "../src/inteinterfaces";

declare global {
  namespace Express {
    interface Request {
      
    }
  }
  
}

