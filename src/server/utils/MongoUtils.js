const _ = require("lodash");
const qs = require("querystring");

const MongoUtils = {
  buildMongoUri(dbConfig) {
    const { username, password, host, schema } = dbConfig;
    const port = dbConfig.port || 27017;

    let mongoUri = `mongodb://`;
    if (username && password) {
      mongoUri += `${encodeURIComponent(username)}:${encodeURIComponent(
        password
      )}@`;
    }

    mongoUri += `${host}:${port}/${schema}`;

    const connectionOptions = dbConfig.options;
    if (!_.isEmpty(connectionOptions)) {
      mongoUri += `?${qs.stringify(connectionOptions)}`;
    }

    return mongoUri;
  },
};

module.exports = MongoUtils;
