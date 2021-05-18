const bcrypt = require("bcrypt");
const crypto = require("crypto");

const saltRounds = 8;

const generatePasswordHash = async (password) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return passwordHash;
};

const comparePassword = async (password, passwordHash) => {
  const isCorrectPassword = await bcrypt.compare(password, passwordHash);

  return isCorrectPassword;
};

const generateRandomUniqueToken = () => {
  const buffer = crypto.randomBytes(48);
  const token = buffer.toString("hex");

  return token;
};

module.exports = {
  generatePasswordHash,
  generateRandomUniqueToken,
  comparePassword,
};
