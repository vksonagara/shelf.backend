const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  folderId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: () => moment().toDate() },
  updatedAt: { type: Date, default: () => moment().toDate() },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

NoteSchema.index({ title: 1 });
NoteSchema.index({ folderId: 1, userId: 1 });

const Note = model("Note", NoteSchema, "Notes");

module.exports = Note;
