const Folder = require("../../models/Folder");

class FolderUtils {
  static async createFolder({ name, userId }) {
    const folder = await Folder.create({
      name,
      userId,
    });

    return folder.toJSON();
  }
}

module.exports = FolderUtils;
