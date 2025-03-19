import winston from "winston"

export const logger = winston.createLogger({
  level: "verbose",
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})
