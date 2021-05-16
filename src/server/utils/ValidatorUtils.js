const _ = require("lodash");
const errors = require("../errors");

const validate = (schema, value) => {
  const { error } = schema.validate(value, { abortEarly: false });

  if (error) {
    const messages = _.map(error.details, (err) => {
      return err.message;
    });
    throw new errors.ValidationError(messages);
  }
};

module.exports = { validate };
