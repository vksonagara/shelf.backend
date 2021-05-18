const { Schema, model } = require("mongoose");

const UserSessionSchema = new Schema({
  refreshToken: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

UserSessionSchema.index({ refreshToken: 1 });
UserSessionSchema.index({ userId: 1 });

const UserSession = model("UserSession", UserSessionSchema, "UserSessions");

module.exports = UserSession;
