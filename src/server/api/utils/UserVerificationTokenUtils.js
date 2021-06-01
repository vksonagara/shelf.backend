const moment = require("moment-timezone");
const UserVerificationToken = require("../../models/UserVerificationToken");
const CryptoUtils = require("../../utils/CryptoUtils");
const AppConstants = require("../../constants/AppConstants");

class UserVerificationTokenUtils {
  static async createToken(userId) {
    const token = CryptoUtils.generateRandomUniqueToken();

    // Create expire date for token
    const expiresAt = moment()
      .add(
        AppConstants.USER_TOKEN.VERIFICATION_TOKEN_EXPIRE_PERIOD,
        "milliseconds"
      )
      .toDate();

    const userVerificationToken = await UserVerificationToken.create({
      token,
      userId,
      expiresAt,
    });

    return userVerificationToken.token;
  }

  static async getUserId(token) {
    const userVerificationToken = await UserVerificationToken.findOne({
      token,
    });

    if (
      userVerificationToken &&
      moment() > moment(userVerificationToken.expiresAt)
    ) {
      return null;
    }

    return userVerificationToken && userVerificationToken.userId;
  }
}

module.exports = UserVerificationTokenUtils;
