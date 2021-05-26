const { Schema, model } = require("mongoose");
const Note = require("./Note");

const FolderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

FolderSchema.index({ name: 1 });
FolderSchema.index({ userId: 1 });

const Folder = model("Folder", FolderSchema, "Folders");

module.exports = Folder;
