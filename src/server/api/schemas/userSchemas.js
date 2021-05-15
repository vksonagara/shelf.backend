const Joi = require("joi");

const signupSchema = Joi.object({
  firstName: Joi.string().min(3).max(64).required().label("First name"),
  lastName: Joi.string().allow("").label("Last name"),
  emailId: Joi.string().email().required().label("Email"),
  password: Joi.string().min(4).max(64).required().label("Password"),
});

module.exports = {
  signupSchema,
};
