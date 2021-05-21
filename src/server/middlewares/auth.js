const _ = require("lodash");
const errors = require("../errors");
const TokenUtils = require("../utils/TokenUtils");

const checkAuthN = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(new errors.AuthenticationError("Unauthenticated"));
  }

  const accessToken = authHeader.split("Shelf ")[1];

  if (!accessToken) {
    return next(new errors.AuthenticationError("Unauthenticated"));
  }

  const decodedAccessToken = await TokenUtils.verifyAccessToken(accessToken);

  if (_.isEmpty(decodedAccessToken)) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new errors.AuthenticationError("Unauthenticated"));
    }

    const decodedRefreshToken = await TokenUtils.verifyRefreshToken(
      refreshToken
    );

    if (_.isEmpty(decodedRefreshToken)) {
      return next(new errors.AuthenticationError("Unauthenticated"));
    }

    const newAccessToken = await TokenUtils.createAccessToken({
      user: decodedRefreshToken.user,
    });

    req.user = decodedRefreshToken.user;
    res.setHeader("x-access-token", newAccessToken);
  }

  req.user = decodedAccessToken.user;

  return next();
};

module.exports = {
  checkAuthN,
};
