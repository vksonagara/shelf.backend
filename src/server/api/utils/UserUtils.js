const _ = require("lodash");
const User = require("../../models/User");
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
      throw new errors.AppError("Invalid token", 409);
    }

    await User.updateOne({ _id: userId }, { $set: { isVerified: true } });
  }
}

module.exports = UserUtils;
