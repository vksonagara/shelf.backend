const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const FolderSchema = new Schema({
  name: { type: String, required: true, trim: true },
  notesCount: { type: Number, default: 0, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: () => moment().toDate() },
  updatedAt: { type: Date, default: () => moment().toDate() },
});

FolderSchema.index({ name: 1 });
FolderSchema.index({ userId: 1 });

const Folder = model("Folder", FolderSchema, "Folders");

module.exports = Folder;
