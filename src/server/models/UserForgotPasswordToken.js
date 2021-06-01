const { Schema, model } = require("mongoose");
const AppConstants = require("../constants/AppConstants");

const UserForgotPasswordTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    emailId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

UserForgotPasswordTokenSchema.index(
  { createdAt: 1 },
  { expires: AppConstants.USER_TOKEN.FORGOT_PASSWORD_TOKEN_EXPIRE_PERIOD }
);

const UserForgotPasswordToken = model(
  "UserForgotPasswordToken",
  UserForgotPasswordTokenSchema,
  "UserForgotPasswordTokens"
);

module.exports = UserForgotPasswordToken;
