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
    const noteUpdateQuery = {
      $set: { isDeleted: true, deletedAt: moment().format() },
    };

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

  static async getArchiveNotes({ userId }) {
    const noteFilterQuery = { userId, isDeleted: true };
    const noteSelectQuery = { title: 1, userId: 1, deletedAt: 1 };

    const notes = await Note.find(noteFilterQuery, noteSelectQuery).lean();

    _.forEach(notes, (note) => {
      note.deletedAt = moment(note.deletedAt).fromNow();
    });

    return notes;
  }

  static async deleteArchiveNote({ noteId, userId }) {
    const noteFilterQuery = { userId, _id: noteId, isDeleted: true };

    await Note.deleteOne(noteFilterQuery);
  }

  static async getArchiveNoteDetails({ noteId, userId }) {
    const noteFilterQuery = { userId, _id: noteId, isDeleted: true };
    const noteSelectQuery = { title: 1, content: 1, userId: 1, deletedAt: 1 };

    const note = await Note.find(noteFilterQuery, noteSelectQuery).lean();

    if (!note) {
      throw new errors.NotFoundError("Archive note not found");
    }

    note.deletedAt = moment(note.deletedAt).fromNow();

    return { note };
  }

  static async restoreNote({ noteId, folderId, userId }) {
    const noteFilterQuery = { _id: noteId, userId, isDeleted: true };
    const noteUpdateQuery = {
      $set: { folderId, isDeleted: false, deletedAt: null },
    };

    await Note.updateOne(noteFilterQuery, noteUpdateQuery);
  }
}

module.exports = NoteUtils;
