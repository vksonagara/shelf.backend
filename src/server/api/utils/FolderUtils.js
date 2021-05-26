const _ = require("lodash");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Folder = require("../../models/Folder");
const Note = require("../../models/Note");
const errors = require("../../errors");

class FolderUtils {
  static async createFolder({ name, userId }) {
    const folder = (
      await Folder.create({
        name,
        userId,
      })
    ).toJSON();

    folder.createdAt = moment(folder.createdAt).fromNow();
    folder.updatedAt = moment(folder.updatedAt).fromNow();

    return folder;
  }

  static async getUserFolderList({ userId }) {
    const folders = await Folder.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Notes",
          let: { folderId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$folderId", "$$folderId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "notes",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          notesCount: {
            $size: "$notes",
          },
        },
      },
    ]);

    _.forEach(folders, (folder) => {
      folder.createdAt = moment(folder.createdAt).fromNow();
      folder.updatedAt = moment(folder.updatedAt).fromNow();
    });

    return folders;
  }

  static async updateFolder({ name, folderId, userId }) {
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      throw new errors.NotFoundError("Folder not found");
    }

    folder.name = name || folder.name;

    await folder.save();
  }

  static async deleteFolder({ folderId, userId }) {
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      throw new errors.NotFoundError("Folder not found");
    }

    await mongoose.connection.transaction(async () => {
      return Promise.all([
        Folder.deleteOne({ _id: folderId, userId }),
        Note.updateMany(
          { folderId, userId },
          { $set: { isDeleted: true, deletedAt: moment().format() } }
        ),
      ]);
    });
  }
}

module.exports = FolderUtils;
