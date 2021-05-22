const _ = require("lodash");
const moment = require("moment-timezone");
const Folder = require("../../models/Folder");
const errors = require("../../errors");

class FolderUtils {
  static async createFolder({ name, userId }) {
    const folder = await Folder.create({
      name,
      userId,
    });

    return folder.toJSON();
  }

  static async getUserFolderList({ userId }) {
    const folders = await Folder.find({ userId }).lean();

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
}

module.exports = FolderUtils;
