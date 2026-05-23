declare namespace Express {
    export interface Request {
        user?: any;
    }
}

import type { Request } from "express";

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      };
}