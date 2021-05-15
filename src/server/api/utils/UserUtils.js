const _ = require("lodash");
const User = require("../../models/User");
const CryptoUtils = require("../../utils/CryptoUtils");
const errors = require("../../errors");

class UserUtils {
  static async addUser({ firstName, lastName, emailId, password }) {
    const userCount = await User.countDocuments({
      emailId,
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
}

module.exports = UserUtils;
