const ejs = require("ejs");
const config = require("../config");

class TemplateUtils {
  static async getHtmlContent(templateName, data) {
    const htmlContent = await ejs.renderFile(
      `${config.get("paths:templates")}/${templateName}.ejs`,
      data
    );

    return htmlContent;
  }
}

module.exports = TemplateUtils;
