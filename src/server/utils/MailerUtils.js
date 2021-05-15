const config = require("../config");
const mailjet = require("node-mailjet");

const mailer = mailjet.connect(
  config.get("mailjet:apiKey"),
  config.get("mailjet:secretKey")
);

const sendVerifyEmail = async ({ firstName, emailId, verificationToken }) => {
  await mailer.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "vksonagara1996@gmail.com",
          Name: "PA",
        },
        To: [
          {
            Email: emailId,
            Name: firstName,
          },
        ],
        Subject: "PA signup - verify email address",
        TextPart: `Hi ${firstName}, Please verify your email using this token: ${verificationToken}`,
      },
    ],
  });
};

module.exports = {
  sendVerifyEmail,
};
