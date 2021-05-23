const ApiValidator = require("../utils/ValidatorUtils");
const noteSchemas = require("./schemas/noteSchemas");
const NoteUtils = require("./utils/NoteUtils");

class NoteApi {
  static async createNote(object, options) {
    const { user } = options;
    ApiValidator.validate(noteSchemas.createNoteSchema, object);
    const note = await NoteUtils.createNote({ ...object, userId: user.id });

    return note;
  }
}

module.exports = NoteApi;
