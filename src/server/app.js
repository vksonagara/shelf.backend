const express = require("express");
const debug = require("debug")("pa:init");
// const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const compress = require("compression");
const config = require("./config");
const { logContextMiddleware, requestLogMiddleware } = require("./logger");
const api = require("./api/app.js");

const app = express();

debug(`Starting server...`);

// parse application/json
app.use(bodyParser.json({}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "4mb" }));

// enable gzip compression
app.use(compress());

// CORS pre-flight check
app.options(`*`, cors);

// enable cors
app.use(cors());

// logging request
app.use(requestLogMiddleware);

// adding request context to logger
app.use(logContextMiddleware);

// adding api routes
app.use("/api", api);

app.listen(config.get("server:port"), () => {
  debug(`Server started on port: ${config.get("server:port")}`);
});

module.export = app;
