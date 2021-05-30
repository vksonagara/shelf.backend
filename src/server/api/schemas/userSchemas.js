const Joi = require("joi");

const signupSchema = Joi.object({
  firstName: Joi.string().min(3).max(64).required().label("First name"),
  lastName: Joi.string().allow("").label("Last name"),
  emailId: Joi.string().email().required().label("Email"),
  password: Joi.string().min(4).max(64).required().label("Password"),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

const signInSchema = Joi.object({
  emailId: Joi.string().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().required(),
});

const forgotPassword = Joi.object({
  emailId: Joi.string().required(),
});

const resetPassword = Joi.object({
  emailId: Joi.string().required(),
  newPassword: Joi.string().required(),
  token: Joi.string().required(),
});

module.exports = {
  signupSchema,
  verifyEmailSchema,
  signInSchema,
  forgotPassword,
  resetPassword,
};
