const _ = require("lodash");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const CryptoUtils = require("../../utils/CryptoUtils");
const errors = require("../../errors");
const UserVerificationTokenUtils = require("./UserVerificationTokenUtils");
const AppConstants = require("../../constants/AppConstants");
const UserForgotPasswordToken = require("../../models/UserForgotPasswordToken");

class UserUtils {
  static async addUser({ firstName, lastName, emailId, password }) {
    const userCount = await User.countDocuments({
      emailId,
      isDeleted: false,
      isVerified: true,
    });

    if (userCount > 0) {
      throw new errors.AppError("Email already registered", 409);
    }

    const passwordHash = await CryptoUtils.generatePasswordHash(password);
    const user = await User.create({
      firstName,
      lastName: lastName || "",
      emailId: emailId,
      password: passwordHash,
    });

    return _.omit(user.toJSON(), ["password"]);
  }

  static async verifyEmail(token) {
    const userId = await UserVerificationTokenUtils.getUserId(token);

    if (!userId) {
      throw new errors.AppError("Token invalid/expired", 409);
    }

    const user = await User.findOne({ _id: userId }).lean();
    const alreadyVerifiedEmail = await User.findOne({
      emailId: user.emailId,
      isVerified: true,
    }).lean();

    if (_.isEmpty(alreadyVerifiedEmail)) {
      await User.updateOne({ _id: userId }, { $set: { isVerified: true } });
    }
  }

  static async isCorrectCredentials({ emailId, password }) {
    const user = await User.findOne({
      emailId,
      isVerified: true,
      isDeleted: false,
    }).lean();

    if (_.isEmpty(user)) {
      return false;
    }

    const isCorrectPassword = await CryptoUtils.comparePassword(
      password,
      user.password
    );

    return isCorrectPassword;
  }

  static async getUser(filter) {
    const user = await User.findOne(filter).lean();

    return _.omit(user, ["password"]);
  }

  static async addUserSession(refreshToken, userId) {
    await UserSession.create({
      refreshToken,
      userId,
    });
  }

  static async getUserSessions(userId) {
    const userSessions = await UserSession.find({
      userId,
    }).lean();

    return userSessions;
  }

  // Use to logout user from all devices
  static async destroyUserSessions(userId) {
    await UserSession.deleteMany({
      userId,
    });
  }

  // Block user request from a particular `refreshToken` or use for sign-out
  static async destroyUserSession(refreshToken) {
    await UserSession.deleteOne({
      refreshToken,
    });
  }

  // create forgot password token for a user
  static async createForgotPasswordToken({ tokenHash, userId, emailId }) {
    await mongoose.connection.transaction(async () => {
      await UserForgotPasswordToken.deleteMany({ emailId });
      await UserForgotPasswordToken.create({
        tokenHash,
        userId,
        emailId,
        expiresAt: moment().add(
          AppConstants.USER_TOKEN.FORGOT_PASSWORD_TOKEN_EXPIRE_PERIOD,
          "milliseconds"
        ),
      });
    });
  }

  static async isValidForgotPasswordToken({ token, emailId }) {
    const forgotPasswordToken = await UserForgotPasswordToken.findOne({
      emailId,
    }).lean();

    if (!forgotPasswordToken) {
      return false;
    }

    const isValid = await CryptoUtils.compareToken(
      token,
      forgotPasswordToken.tokenHash
    );

    const isNotExpired = moment() < moment(forgotPasswordToken.expiresAt);

    return isValid && isNotExpired ? forgotPasswordToken : {};
  }

  static async changePassword({ userId, password }) {
    const passwordHash = await CryptoUtils.generatePasswordHash(password);

    await mongoose.connection.transaction(async () => {
      await UserForgotPasswordToken.deleteMany({ userId });
      await User.updateOne(
        { _id: userId },
        { $set: { password: passwordHash } }
      );
    });
  }
}

module.exports = UserUtils;
