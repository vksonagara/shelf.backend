const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    folderId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

NoteSchema.index({ title: 1 });
NoteSchema.index({ folderId: 1, userId: 1 });

const Note = model("Note", NoteSchema, "Notes");

module.exports = Note;
