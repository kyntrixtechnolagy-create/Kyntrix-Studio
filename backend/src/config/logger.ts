import winston from 'winston';
import path from 'path';

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'founder-os-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({ filename: path.join(process.cwd(), 'logs/error.log'), level: 'error' }));
  logger.add(new winston.transports.File({ filename: path.join(process.cwd(), 'logs/combined.log') }));
}

// Console transport is already added by default.
