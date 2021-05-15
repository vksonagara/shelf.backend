const userSchemas = require("./schemas/userSchemas");
const ApiValidator = require("../utils/ValidatorUtils");
const UserUtils = require("./utils/UserUtils");
const MailerUtils = require("../utils/MailerUtils");

class UserApi {
  static async signup(object, options) {
    ApiValidator.validate(userSchemas.signupSchema, object);
    const user = await UserUtils.addUser(object);
    await MailerUtils.sendVerifyEmail({
      firstName: user.firstName,
      emailId: user.emailId,
      verificationToken: "test",
    });

    return user;
  }
}

module.exports = UserApi;
