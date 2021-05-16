const { Schema, model } = require("mongoose");

const UserVerificationTokenSchema = new Schema({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true, default: null },
});

const UserVerificationToken = model(
  "UserVerificationToken",
  UserVerificationTokenSchema,
  "UserVerificationTokens"
);

module.exports = UserVerificationToken;

// Use cron jobs delete expired tokens
