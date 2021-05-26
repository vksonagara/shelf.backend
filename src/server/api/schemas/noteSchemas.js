const Joi = require("joi");
const AppConstants = require("../../constants/AppConstants");

const createNoteSchema = Joi.object({
  title: Joi.string().allow(""),
  content: Joi.string().allow(""),
  folderId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX).required(),
});

const getFolderNotes = Joi.object({
  folderId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX).required(),
});

const getDetails = Joi.object({
  noteId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX).required(),
});

const updateNote = Joi.object({
  noteId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX).required(),
  title: Joi.string(),
  content: Joi.string().allow(""),
  folderId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX),
});

const deleteNote = Joi.object({
  noteId: Joi.string().regex(AppConstants.OBJECT_ID_REGEX).required(),
});

module.exports = {
  createNoteSchema,
  getFolderNotes,
  getDetails,
  updateNote,
  deleteNote,
};
