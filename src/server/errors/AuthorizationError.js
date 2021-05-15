const AppError = require("./AppError");

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

module.exports = AuthorizationError;
