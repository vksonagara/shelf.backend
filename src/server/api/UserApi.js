const userSchemas = require("./schemas/userSchemas");
const ApiValidator = require("../utils/ValidatorUtils");
const UserUtils = require("./utils/UserUtils");
const MailerUtils = require("../utils/MailerUtils");
const UserVerificationTokenUtils = require("./utils/UserVerificationTokenUtils");

class UserApi {
  static async signup(object, options) {
    ApiValidator.validate(userSchemas.signupSchema, object);
    const user = await UserUtils.addUser(object);
    const verificationToken = await UserVerificationTokenUtils.createToken(
      user._id
    );

    await MailerUtils.sendVerifyEmail({
      firstName: user.firstName,
      emailId: user.emailId,
      verificationToken,
    });

    return user;
  }

  static async verifyEmail(object, options) {
    const { query } = options;
    ApiValidator.validate(userSchemas.verifyEmailSchema, query);
    await UserUtils.verifyEmail(query.token);

    return { message: "Email verification complete" };
  }
}

module.exports = UserApi;
