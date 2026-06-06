import { sendResponse } from '@server/utils/apiResponse';
import { HttpStatusCode } from '@server/utils/httpStatusCode';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string;
}

export const createRateLimit = ({
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = 'Too many requests, please try again later.',
}: RateLimitOptions = {}): RateLimitRequestHandler => {
    return rateLimit({
        windowMs,
        max,
        // Better production settings
        standardHeaders: true,
        legacyHeaders: false,
        // Prevent counting successful login attempts
        skipSuccessfulRequests: false,
        // Better JSON response
        handler: (_req, res) => {
            sendResponse(res, HttpStatusCode.TOO_MANY_REQUESTS, false, message);
        },
    });
};

export const authLimiter = createRateLimit({
    max: 15,
    message: 'Too many login attempts. Please try again later.',
});

export const apiLimiter = createRateLimit({
    max: 1000,
});

export const passwordResetLimiter = createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many password reset attempts.',
});