const config = require("../config");
const mailjet = require("node-mailjet");
const TemplateUtils = require("./TemplateUtils");
const AppConstants = require("../constants/AppConstants");

const mailer = mailjet.connect(
  config.get("mailjet:apiKey"),
  config.get("mailjet:secretKey")
);

const sendVerifyEmail = async ({ firstName, emailId, verificationToken }) => {
  const link = `${config.get(
    "frontend:url"
  )}/verify-email?token=${verificationToken}`;
  const htmlContent = await TemplateUtils.getHtmlContent(
    AppConstants.TEMPLATES.VERIFY_EMAIL_TEMPLATE,
    {
      firstName,
      emailId,
      link,
    }
  );

  await mailer.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: config.get("mail:info:email"),
          Name: config.get("mail:info:name"),
        },
        To: [
          {
            Email: emailId,
            Name: firstName,
          },
        ],
        Subject: "Shelf - verify email address",
        // TextPart: `Hi ${firstName}, Please verify your email using this link: ${config.get(
        //   "frontend:url"
        // )}/verify-email?token=${verificationToken}`,
        HTMLPart: htmlContent,
      },
    ],
  });
};

const sendForgotPasswordMail = async ({ firstName, emailId, token }) => {
  const link = `${config.get(
    "frontend:url"
  )}/reset-password?token=${token}`;
  const htmlContent = await TemplateUtils.getHtmlContent(
    AppConstants.TEMPLATES.FORGOT_PASSWORD_TEMPLATE,
    {
      firstName,
      emailId,
      link,
    }
  );

  await mailer.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: config.get("mail:info:email"),
          Name: config.get("mail:info:name"),
        },
        To: [
          {
            Email: emailId,
            Name: firstName,
          },
        ],
        Subject: "Shelf - reset password",
        // TextPart: `Hi ${firstName}, Here is the link to reset your password: ${config.get(
        //   "frontend:url"
        // )}/reset-password?token=${token}`,
        HTMLPart: htmlContent,
      },
    ],
  });
};

module.exports = {
  sendVerifyEmail,
  sendForgotPasswordMail,
};
