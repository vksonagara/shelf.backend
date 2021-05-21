const Joi = require("joi");

const createFolderSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  createFolderSchema,
};
