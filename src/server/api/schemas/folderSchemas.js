const Joi = require("joi");
const { OBJECT_ID_REGEX } = require("../../constants/AppConstants");

const createFolderSchema = Joi.object({
  name: Joi.string().required(),
});

const updateFolderSchema = Joi.object({
  folderId: Joi.string().regex(OBJECT_ID_REGEX).required(),
  name: Joi.string().allow(""),
});

module.exports = {
  createFolderSchema,
  updateFolderSchema,
};
