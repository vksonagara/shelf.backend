const _ = require("lodash");
const moment = require("moment-timezone");
const Note = require("../../models/Note");
const errors = require("../../errors");

class NoteUtils {
  static async createNote({ title, content, folderId, userId }) {
    let note;

    if (!title) {
      title = await this.getNextNewNoteTitle({ folderId, userId });
    }

    note = (await Note.create({ title, content, folderId, userId })).toJSON();

    note.createdAt = moment(note.createdAt).fromNow();
    note.updatedAt = moment(note.updatedAt).fromNow();

    return note;
  }

  static async getFolderNotes({ folderId, userId }) {
    const noteFilterQuery = { folderId, userId, isDeleted: false };
    const noteSelectQuery = { content: 0 };

    const notes = await Note.find(noteFilterQuery, noteSelectQuery).lean();

    _.forEach(notes, (note) => {
      note.createdAt = moment(note.createdAt).fromNow();
      note.updatedAt = moment(note.updatedAt).fromNow();
    });

    return notes;
  }

  static async getDetails({ noteId, userId }) {
    const noteFilterQuery = { _id: noteId, userId, isDeleted: false };

    const note = await Note.findOne(noteFilterQuery).lean();

    if (!note) {
      throw new errors.NotFoundError("Note not found");
    }

    note.createdAt = moment(note.createdAt).fromNow();
    note.updatedAt = moment(note.updatedAt).fromNow();

    return note;
  }

  static async updateNote({ noteId, userId, note }) {
    const noteFilterQuery = { _id: noteId, userId, isDeleted: false };
    const noteUpdateQuery = { $set: note };

    const noteCount = await Note.countDocuments(noteFilterQuery);

    if (noteCount === 0) {
      throw new errors.NotFoundError("Note not found");
    }

    await Note.updateOne(noteFilterQuery, noteUpdateQuery);
  }

  static async deleteNote({ noteId, userId }) {
    const noteFilterQuery = { _id: noteId, userId, isDeleted: false };
    const noteUpdateQuery = { $set: { isDeleted: true } };

    await Note.updateOne(noteFilterQuery, noteUpdateQuery);
  }

  static async getNextNewNoteTitle({ folderId, userId }) {
    const noteFilterQuery = { folderId, userId, isDeleted: false };
    const notes = await Note.find(noteFilterQuery).lean();

    const newNoteTitlePrefix = `New Note`;
    let count = 1;

    while (true) {
      const newNoteTitle = `${newNoteTitlePrefix} ${count}`;
      const findIndex = _.findIndex(notes, (note) => {
        return note.title === newNoteTitle;
      });

      if (findIndex < 0) {
        return newNoteTitle;
      }

      count++;
    }
  }
}

module.exports = NoteUtils;
