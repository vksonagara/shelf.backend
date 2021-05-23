const Joi = require("joi");
const AppConstants = require("../../constants/AppConstants");

const createNoteSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().allow(""),
  folderId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX).required(),
});

module.exports = {
  createNoteSchema,
};
