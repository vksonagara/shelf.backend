const ApiValidator = require("../utils/ValidatorUtils");
const folderSchemas = require("./schemas/folderSchemas");
const FolderUtils = require("./utils/FolderUtils");

class FolderApi {
  static async createFolder(object, options) {
    ApiValidator.validate(folderSchemas.createFolderSchema, object);
    const { name } = object;
    const { user } = options;
    const folder = await FolderUtils.createFolder({ name, userId: user.id });

    return { folder };
  }

  static async getUserFolderList(object, options) {
    const { user } = options;
    const folders = await FolderUtils.getUserFolderList({ userId: user.id });

    return { folders };
  }

  static async updateFolder(object, options) {
    const { name } = object;
    const { folderId } = options.params;
    const { user } = options;
    ApiValidator.validate(folderSchemas.updateFolderSchema, { name, folderId });
    await FolderUtils.updateFolder({ name, folderId, userId: user.id });
  }
}

module.exports = FolderApi;
