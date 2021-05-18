const _ = require("lodash");
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const CryptoUtils = require("../../utils/CryptoUtils");
const errors = require("../../errors");
const UserVerificationTokenUtils = require("./UserVerificationTokenUtils");

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
}

module.exports = UserUtils;
