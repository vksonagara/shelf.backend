const _ = require("lodash");
const userSchemas = require("./schemas/userSchemas");
const ApiValidator = require("../utils/ValidatorUtils");
const UserUtils = require("./utils/UserUtils");
const MailerUtils = require("../utils/MailerUtils");
const UserVerificationTokenUtils = require("./utils/UserVerificationTokenUtils");
const TokenUtils = require("../utils/TokenUtils");
const CryptoUtils = require("../utils/CryptoUtils");
const errors = require("../errors");

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

    return { message: "Sign up successful" };
  }

  static async verifyEmail(object, options) {
    const { query } = options;
    ApiValidator.validate(userSchemas.verifyEmailSchema, query);
    await UserUtils.verifyEmail(query.token);

    return { message: "Email verification completed" };
  }

  static async signIn(object, options) {
    ApiValidator.validate(userSchemas.signInSchema, object);
    const isCorrectCredentials = await UserUtils.isCorrectCredentials(object);

    if (!isCorrectCredentials) {
      throw new errors.AppError("Incorrect credentials", 409);
    }

    const { emailId, rememberMe } = object;
    const user = await UserUtils.getUser({
      emailId,
      isVerified: true,
      isDeleted: false,
    });

    const accessToken = await TokenUtils.createAccessToken({
      user: {
        id: user._id,
        emailId: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    const refreshToken = await TokenUtils.createRefreshToken(
      {
        user: {
          id: user._id,
          emailId: user.emailId,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      rememberMe
    );
    await UserUtils.addUserSession(refreshToken, user._id);

    return function (req, res, next) {
      const options = {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires after 1 month
        httpOnly: true,
      };

      res.cookie("refreshToken", refreshToken, options);
      res.json({
        accessToken,
      });
    };
  }

  static async refreshAccessToken(object, options) {
    const { cookies } = options;
    const { refreshToken } = cookies;

    const decoded = await TokenUtils.verifyRefreshToken(refreshToken);

    if (_.isEmpty(decoded)) {
      throw new errors.AuthenticationError("Unauthenticated");
    }

    const userSessions = await UserUtils.getUserSessions(decoded.user.id);

    if (
      _.findIndex(userSessions, (session) => {
        return session.refreshToken === refreshToken;
      }) === -1
    ) {
      throw new errors.AuthenticationError("Unauthenticated");
    }

    const user = await UserUtils.getUser({ _id: decoded.user.id });
    const accessToken = await TokenUtils.createAccessToken({
      user: {
        id: user._id,
        emailId: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    return { accessToken };
  }

  static async signOut(object, options) {
    const { cookies } = options;
    const { refreshToken } = cookies;

    await UserUtils.destroyUserSession(refreshToken);

    return function (req, res, next) {
      res.clearCookie("refreshToken");
      res.end();
    };
  }

  static async sendForgotPasswordLink(object, options) {
    ApiValidator.validate(userSchemas.forgotPassword, object);
    const { emailId } = object;

    const userFilter = { emailId, isVerified: 1, isDeleted: false };
    const user = await UserUtils.getUser(userFilter);

    if (!user) {
      return;
    }

    const token = CryptoUtils.generateUniqueToken128Bytes();
    const tokenHash = await CryptoUtils.generateTokenHash(token);

    await UserUtils.createForgotPasswordToken({
      tokenHash,
      userId: user._id,
      emailId,
    });

    // send forgot password mail to user email
    MailerUtils.sendForgotPasswordMail({
      firstName: user.firstName,
      emailId,
      token,
    });
  }

  static async resetPassword(object, options) {
    ApiValidator.validate(userSchemas.resetPassword, object);
    const { emailId, newPassword, token } = object;

    const validToken = await UserUtils.isValidForgotPasswordToken({
      token,
      emailId,
    });

    if (_.isEmpty(validToken)) {
      throw new errors.AppError("Token invalid/expired", 409);
    }

    await UserUtils.changePassword({
      userId: validToken.userId,
      password: newPassword,
    });
    await UserUtils.destroyUserSessions(validToken.userId);
  }
}

module.exports = UserApi;
