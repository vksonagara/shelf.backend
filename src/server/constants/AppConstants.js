const verificationTokenExpirePeriod = 7; // Expire period for user email verification token in days

const JWT_TOKEN = {
  ACCESS_TOKEN_EXPIRE_DURATION: 60 * 60, // 60 mins
  REFRESH_TOKEN_EXPIRE_DURATION: 24 * 60 * 60, // 24 hrs
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60, // 7 days
};

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

module.exports = {
  verificationTokenExpirePeriod,
  JWT_TOKEN,
  OBJECT_ID_REGEX,
};
