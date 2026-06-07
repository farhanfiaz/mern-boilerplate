import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        isSystemAdmin: boolean;
        tenantId: string;
      };
    }
  }
}


export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?:
  | Express.Multer.File[]
  | {
    [fieldname: string]: Express.Multer.File[];
  };
}