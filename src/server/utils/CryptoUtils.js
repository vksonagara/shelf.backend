const bcrypt = require("bcrypt");

const saltRounds = 8;

const generatePasswordHash = async (password) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return passwordHash;
};

module.exports = {
  generatePasswordHash,
};
