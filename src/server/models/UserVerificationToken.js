const { Schema, model } = require("mongoose");
const AppConstants = require("../constants/AppConstants");

const UserVerificationTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, default: null },
  },
  { timestamps: true }
);

UserVerificationTokenSchema.index(
  { createdAt: 1 },
  { expires: AppConstants.USER_TOKEN.VERIFICATION_TOKEN_EXPIRE_PERIOD }
);

const UserVerificationToken = model(
  "UserVerificationToken",
  UserVerificationTokenSchema,
  "UserVerificationTokens"
);

module.exports = UserVerificationToken;
