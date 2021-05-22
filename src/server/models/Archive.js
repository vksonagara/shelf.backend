const { Schema, model } = require("mongoose");

const ArchiveSchema = new Schema({
  noteIds: [{ type: Schema.Types.ObjectId }],
  userId: { type: Schema.Types.ObjectId },
});

ArchiveSchema.index({ userId: 1 });

const Archive = model("Archive", ArchiveSchema, "Archives");

module.exports = Archive;
