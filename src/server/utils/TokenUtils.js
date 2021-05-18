const jwt = require("jsonwebtoken");
const AppConstants = require("../constants/AppConstants");
const config = require("../config");

const createAccessToken = async (payload) => {
  const options = {
    expiresIn: AppConstants.JWT_TOKEN.ACCESS_TOKEN_EXPIRE_DURATION,
  };
  const token = await jwt.sign(
    payload,
    config.get("jwt:accessSecret"),
    options
  );

  return token;
};

const createRefreshToken = async (payload, rememberMe) => {
  const options = {
    expiresIn: rememberMe
      ? AppConstants.JWT_TOKEN.REMEMBER_ME_DURATION
      : AppConstants.JWT_TOKEN.REFRESH_TOKEN_EXPIRE_DURATION,
  };
  const token = await jwt.sign(
    payload,
    config.get("jwt:refreshSecret"),
    options
  );

  return token;
};

const verifyRefreshToken = async (token) => {
  try {
    const payload = await jwt.verify(token, config.get("jwt:refreshSecret"));

    return payload;
  } catch (err) {
    return {};
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};
