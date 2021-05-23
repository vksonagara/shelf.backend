const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Note = require("../../models/Note");
const Folder = require("../../models/Folder");

class NoteUtils {
  static async createNote({ title, content, folderId, userId }) {
    let note;

    await mongoose.connection.transaction(async () => {
      note = (await Note.create({ title, content, folderId, userId })).toJSON();

      await Folder.updateOne(
        { _id: folderId, userId },
        { $inc: { notesCount: 1 } }
      );
    });

    note.createdAt = moment(note.createdAt).fromNow();
    note.updatedAt = moment(note.updatedAt).fromNow();

    return note;
  }
}

module.exports = NoteUtils;
