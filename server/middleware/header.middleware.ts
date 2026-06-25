import { Request, Response, NextFunction } from 'express';
import config from '@server/config/app.config';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    const isSecureRequest = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (config.isProduction && isSecureRequest) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
};