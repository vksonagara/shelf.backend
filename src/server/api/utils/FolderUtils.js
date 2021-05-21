const _ = require("lodash");
const moment = require("moment-timezone");
const Folder = require("../../models/Folder");

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
}

module.exports = FolderUtils;
