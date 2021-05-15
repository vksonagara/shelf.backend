global.Promise = require("bluebird");
const moment = require("moment-timezone");
const MongoConnector = require("./server/models");
const { logger } = require("./server/logger");

moment.tz.setDefault("Asia/Calcutta");

require("./server/config");
require("./server/app");

(async () => {
  await MongoConnector.connectToMongo();
})().catch((err) => {
  logger.error(err.message, err);
  process.exit(2);
});
