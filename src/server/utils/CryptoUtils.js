const bcrypt = require("bcryptjs");
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

const generateUniqueToken128Bytes = () => {
  const buffer = crypto.randomBytes(128);
  const token = buffer.toString("hex");

  return token;
}

const generateTokenHash = async (token) => {
  const tokenHash = await bcrypt.hash(token, saltRounds);

  return tokenHash;
}

const compareToken = async (token, tokenHash) => {
  const isCorrectToken = await bcrypt.compare(token, tokenHash);

  return isCorrectToken;
}

module.exports = {
  generatePasswordHash,
  generateRandomUniqueToken,
  comparePassword,
  generateTokenHash,
  compareToken,
  generateUniqueToken128Bytes
};
