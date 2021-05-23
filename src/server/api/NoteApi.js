const ApiValidator = require("../utils/ValidatorUtils");
const noteSchemas = require("./schemas/noteSchemas");
const NoteUtils = require("./utils/NoteUtils");

class NoteApi {
  static async createNote(object, options) {
    const { user, params } = options;
    const { folderId } = params;

    ApiValidator.validate(noteSchemas.createNoteSchema, {
      ...object,
      folderId,
    });

    const note = await NoteUtils.createNote({
      ...object,
      folderId,
      userId: user.id,
    });

    return { note };
  }

  static async getFolderNotes(object, options) {
    const { user, params } = options;
    const { folderId } = params;

    ApiValidator.validate(noteSchemas.getFolderNotes, { folderId });

    const notes = await NoteUtils.getFolderNotes({ folderId, userId: user.id });

    return { notes };
  }

  static async getDetails(object, options) {
    const { user, params } = options;
    const { noteId } = params;

    ApiValidator.validate(noteSchemas.getDetails, { noteId });

    const note = await NoteUtils.getDetails({ noteId, userId: user.id });

    return { note };
  }
}

module.exports = NoteApi;
