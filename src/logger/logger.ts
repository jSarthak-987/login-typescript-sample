import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';

const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${JSON.stringify(message)}`;
});

// Create the logger
const logger = winston.createLogger({
    level: 'debug',
    format: combine(timestamp(), logFormat),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: combine(winston.format.colorize(), logFormat),
        }),
        new winston.transports.Stream({
            level: 'debug',
            stream: fs.createWriteStream('logs/application.debug.log', { flags: 'a' }),
        }),
        new winston.transports.Stream({
            level: 'info',
            stream: fs.createWriteStream('logs/application.info.log', { flags: 'a' }),
        }),
        new winston.transports.Stream({
            level: 'warn',
            stream: fs.createWriteStream('logs/application.warn.log', { flags: 'a' }),
        }),
        new winston.transports.Stream({
            level: 'error',
            stream: fs.createWriteStream('logs/application.error.log', { flags: 'a' }),
        }),
        new winston.transports.Stream({
            level: 'fatal',
            stream: fs.createWriteStream('logs/application.fatal.log', { flags: 'a' }),
        }),
        new winston.transports.DailyRotateFile({
            level: 'debug',
            dirname: 'logs/rotate',
            filename: 'debug-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new winston.transports.DailyRotateFile({
            level: 'error',
            dirname: 'logs/rotate',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});

export default logger;