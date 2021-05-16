const errors = require("../errors");
const { logger } = require("../logger");

const handleResourceNotFountError = (req, res, next) => {
  next(new errors.NotFoundError("Resource not found"));
};

const handleJSONResponse = (err, req, res, next) => {
  if (!(err instanceof errors.AppError)) {
    logger.error(err);
    res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
    });
  } else {
    logger.info(err);
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};

module.exports = {
  handleResourceNotFountError,
  handleJSONResponse,
};
