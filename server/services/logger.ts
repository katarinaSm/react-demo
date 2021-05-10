const winston = require('winston');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = (name: string) =>
  winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.printf(({ level, message }) => `[${level}]:  ${name}: ${message} `),
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
        timestamp: true,
      }),
    ],
  });

export default logger;
