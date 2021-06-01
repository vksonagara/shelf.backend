const JWT_TOKEN = {
  ACCESS_TOKEN_EXPIRE_DURATION: 60 * 60, // 60 mins in seconds
  REFRESH_TOKEN_EXPIRE_DURATION: 24 * 60 * 60, // 24 hrs in seconds
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60, // 7 days in seconds
};

const USER_TOKEN = {
  VERIFICATION_TOKEN_EXPIRE_PERIOD: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  FORGOT_PASSWORD_TOKEN_EXPIRE_PERIOD: 1 * 60 * 60 * 1000, // 1 hours in milliseconds
};

const TEMPLATES = {
  VERIFY_EMAIL_TEMPLATE: "verifyEmail",
  FORGOT_PASSWORD_TEMPLATE: "forgotPassword",
};

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

module.exports = {
  JWT_TOKEN,
  OBJECT_ID_REGEX,
  USER_TOKEN,
  TEMPLATES,
};
