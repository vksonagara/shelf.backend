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
}

module.exports = FolderApi;
