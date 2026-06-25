import config from "@server/config/app.config";
import logger from "@server/utils/logger";

export const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        const allowedOrigins = config.frontend.urls || [];
        logger.info(`[CORS] Incoming request from origin: ${origin || 'No origin (e.g., Postman or mobile app)'}`);
        logger.info(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Allow same-origin requests (for static files like WebViewer)
        // This handles cases where origin matches the request host
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else if (config.isDevelopment) {
            // In development, allow all origins
            callback(null, true);
        } else {
            // In production, log the blocked origin for debugging
            logger.warn(`[CORS] Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'user-id']
};