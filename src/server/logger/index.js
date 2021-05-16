const winston = require("winston");
const moment = require("moment-timezone");
const uuid = require("uuid");
const config = require("../config");
const context = require("../utils/AsyncContextUtil");

// Custom format for logging
const customFormat = winston.format((info, opts) => {
  return {
    timestamp: moment().format(),
    ...info,
  };
});

// Creating logger
const logger = winston.createLogger({
  level: config.get("logs:level"),
  format: winston.format.combine(customFormat(), winston.format.json()),
  transports: [
    new winston.transports.File({
      filename: `${config.get("paths:logs")}/error.log`,
      level: "error",
    }),
    new winston.transports.File({
      filename: `${config.get("paths:logs")}/combined.log`,
    }),
  ],
});

// Adding `console` as transports for development
if (config.get("env") !== "production") {
  logger.add(new winston.transports.Console({}));
}

// request logger middleware
const requestLogMiddleware = (req, res, next) => {
  logger.info("Logging request", {
    ipAddress: req.ip,
    url: req.url,
    method: req.method,
    originalUrl: req.originalUrl,
    // headers: req.headers,
    // body: req.body,
    // query: req.query,
  });
  next();
};

// Creating proxy to child logger if exists
const proxyLogger = new Proxy(logger, {
  get(target, property, receiver) {
    target = context.getStore()?.get("logger") || target;
    return Reflect.get(target, property, receiver);
  },
});

// Adding unique id for every request using middleware and child logger
const logContextMiddleware = (req, res, next) => {
  const requestContext = {
    requestId: uuid.v4(),
    ipAddress: req.ip,
    url: req.url,
  };
  const child = logger.child(requestContext);
  const store = new Map();
  store.set("logger", child);

  return context.run(store, next);
};

module.exports = {
  logger: proxyLogger,
  logContextMiddleware,
  requestLogMiddleware,
};
