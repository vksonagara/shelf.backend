const fs = require("fs-extra");
const express = require("express");
const debug = require("debug")("pa:init");
// const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const compress = require("compression");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const config = require("./config");
const { logContextMiddleware, requestLogMiddleware } = require("./logger");
const api = require("./api/app.js");

const app = express();

debug(`Starting server...`);

// parse application/json
app.use(bodyParser.json({}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "4mb" }));

// parse cookies
app.use(cookieParser());

// enable gzip compression
app.use(compress());

// enable cors
app.use(cors({ origin: true, credentials: true }));

// logging request
app.use(requestLogMiddleware);

// adding request context to logger
app.use(logContextMiddleware);

// adding swagger api-docs
if (fs.existsSync(`${config.get("paths:assets")}/swagger.json`)) {
  const swaggerDocument = require(`${config.get("paths:assets")}/swagger.json`);
  // const options = { explorer: true };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
}

// adding api routes
app.use("/api", api);

app.listen(config.get("server:port"), () => {
  debug(`Server started on port: ${config.get("server:port")}`);
});

module.export = app;
