const mongoose = require("mongoose");
const fs = require("fs-extra");
const config = require("../config");
const MongoUtils = require("../utils/MongoUtils");
const debug = require("debug")("pa:database");

let __connectionEstablished = false;

const MongoConnector = {
  async connectToMongo() {
    if (__connectionEstablished) return;

    debug("Connecting to database...");

    __connectionEstablished = true;
    const debugMongo = config.get("database:debug");
    mongoose.set("debug", debugMongo);

    // Connect with database
    const dbConfig = config.get("database");

    const mongoUri = MongoUtils.buildMongoUri(dbConfig);

    const timeout = 30 * 1000;

    const connectOptions = {
      poolSize: 5,
      keepAlive: true,
      keepAliveInitialDelay: 5 * 60 * 100,
      connectTimeoutMS: timeout,
      // to fix deprecation warnings
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    };

    await mongoose.connect(mongoUri, connectOptions);

    debug("Connected to database!");

    debug("Starting Pre-loading models...");

    // pre-load all models
    await fs
      .readdir(__dirname)
      .filter((file) => {
        return file.indexOf(".") > 0 && file !== "index.js";
      })
      .map(async (fileName) => {
        await import("./" + fileName);
      });

    debug("Completed Pre-loading models!")
  },

  async closeConnections() {
    await mongoose.connection.close();
  },
};

module.exports = MongoConnector;
