import path from "path";
import fs from "fs";
import winston, { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import LokiTransport from "winston-loki";

const { combine, timestamp, json, errors, colorize, simple } = format;

// Root logs directory
const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

/**
 * Custom log levels
 */
const customLevels = {
    levels: {
        error: 0,
        important: 1,
        warn: 2,
        info: 3,
        debug: 4,
        audit: 5,
        trackIP: 6,
    },
    colors: {
        error: "red",
        important: "magenta",
        warn: "yellow",
        info: "green",
        debug: "blue",
        audit: "cyan",
        trackIP: "gray",
    },
};

winston.addColors(customLevels.colors);

/**
 * Base format
 */
const baseFormat = combine(
    timestamp(),
    errors({ stack: true }),
    json()
);

/**
 * Filter to allow only a specific level
 */
const onlyLevel = (level: string) =>
    format((info) => (info.level === level ? info : false))();

/**
 * Helper to create rotating transport
 */
const createTransport = (level: string | null, filename: string) =>
    new DailyRotateFile({
        filename: path.join(logDir, `${filename}-%DATE%.log`),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: combine(
            level ? onlyLevel(level) : format((info) => info)(),
            baseFormat
        ),
    });

    const transports: winston.transport[] = [
    createTransport("error", "error"),
    createTransport("important", "important"),
    createTransport("audit", "audit"),
    createTransport("trackIP", "trackIP"),

    // combined logs
    createTransport(null, "combined"),

    // console (dev-friendly)
    new winston.transports.Console({
        format: combine(colorize(), simple()),
    }),
];

// ✅ Conditionally add Loki
if (process.env.LOKI_URL) {
    transports.push(
        new LokiTransport({
            host: process.env.LOKI_URL,
            labels: {
                app: "user-service",
                env: process.env.NODE_ENV || "dev",
            },
            json: true,
            format: winston.format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) =>
                console.error("Loki error:", err),
        })
    );
}

/**
 * Logger instance
 */
const logger = winston.createLogger({
    level: "trackIP", // capture everything
    levels: customLevels.levels,
    defaultMeta: { service: "user-service" },
    transports,
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(logDir, "exceptions-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: baseFormat,
        }),
    ],

    rejectionHandlers: [
        new DailyRotateFile({
            filename: path.join(logDir, "rejections-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: baseFormat,
        }),
    ],
});

export default logger;