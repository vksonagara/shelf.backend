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

  static async updateNote(object, options) {
    const { user, params } = options;
    const { noteId } = params;

    ApiValidator.validate(noteSchemas.updateNote, { ...object, noteId });

    await NoteUtils.updateNote({ note: object, noteId, userId: user.id });
  }

  static async deleteNote(object, options) {
    const { user, params } = options;
    const { noteId } = params;

    ApiValidator.validate(noteSchemas.deleteNote, { noteId });

    await NoteUtils.deleteNote({ noteId, userId: user.id });
  }

  static async getArchiveNotes(object, options) {
    const { user } = options;

    const notes = await NoteUtils.getArchiveNotes({ userId: user.id });

    return { notes };
  }

  static async deleteArchiveNote(object, options) {
    const { user, params } = options;
    const { noteId } = params;

    ApiValidator.validate(noteSchemas.deleteNote, { noteId });

    await NoteUtils.deleteArchiveNote({ noteId, userId: user.id });
  }

  static async getArchiveNoteDetails(object, options) {
    const { user, params } = options;
    const { noteId } = params;

    ApiValidator.validate(noteSchemas.getDetails, { noteId });

    const note = await NoteUtils.getArchiveNoteDetails({
      noteId,
      userId: user.id,
    });

    return { note };
  }

  static async restoreNote(object, options) {
    const { user, params, query } = options;
    const { noteId } = params;
    const { folderId } = query;

    ApiValidator.validate(noteSchemas.restoreNote, { noteId, folderId });

    await NoteUtils.restoreNote({ noteId, folderId, userId: user.id });
  }
}

module.exports = NoteApi;
