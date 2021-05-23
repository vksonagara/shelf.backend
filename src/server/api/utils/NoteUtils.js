const _ = require("lodash");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Note = require("../../models/Note");
const Folder = require("../../models/Folder");
const errors = require("../../errors");

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

  static async getFolderNotes({ folderId, userId }) {
    const notes = await Note.find({ folderId, userId }, { content: 0 }).lean();

    _.forEach(notes, (note) => {
      note.createdAt = moment(note.createdAt).fromNow();
      note.updatedAt = moment(note.updatedAt).fromNow();
    });

    return notes;
  }

  static async getDetails({ noteId, userId }) {
    const note = await Note.findOne({ _id: noteId, userId }).lean();

    if (!note) {
      throw new errors.NotFoundError("Note not found");
    }

    note.createdAt = moment(note.createdAt).fromNow();
    note.updatedAt = moment(note.updatedAt).fromNow();

    return note;
  }
}

module.exports = NoteUtils;
