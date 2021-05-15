const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: () => moment().toDate(),
  },
  updatedAt: {
    type: Date,
    default: () => moment().toDate(),
  },
});

const User = model("User", UserSchema, "Users");

module.exports = User;
