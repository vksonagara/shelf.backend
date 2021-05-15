const path = require("path");
const fs = require("fs-extra");
const Nconf = require("nconf");

const nconf = new Nconf.Provider({});
const env = process.env.NODE_ENV || "development";

(function initialize() {
  // command line argument
  nconf.argv();

  // env arguments
  nconf.env();

  // override with custom config file
  const pathToExternalConfig = `${path.resolve(`.`)}/config`;

  // check if we have an external configuration file
  const environmentConfig = `${pathToExternalConfig}/config.${env}.json`;
  if (!fs.existsSync(environmentConfig)) {
    console.error(
      `No external config file found. Please provide environment config file ${environmentConfig}`
    );
    process.exit(-1);
  }

  // load the given config file
  nconf.file(`environment`, environmentConfig);

  // load the defaults
  const defaults = require("./defaults.json");
  nconf.defaults(defaults);

  // values we have to set manual
  nconf.set(`env`, env);
})();

// configure the paths for the application
(function configurePaths() {
  // directory where all content of the project is put
  const pathToRoot = `${process.cwd()}/`;
  const pathToContent = `${process.cwd()}/content`;
  /**
   * Check if we have read write permission on the directory
   * @param directory
   */
  const checkPermissions = (directory) => {
    let hasEnoughPermissions = null;
    if (!directory) throw new Error(`Invalid directory ${directory}`);

    try {
      fs.accessSync(directory, fs.constants.R_OK | fs.constants.W_OK);
      hasEnoughPermissions = true;
    } catch (e) {
      hasEnoughPermissions = false;
    }

    if (!hasEnoughPermissions) {
      throw new Error(`Not enough permission on ${directory}`);
    }
  };

  const pathToLogs = `${pathToContent}/logs`;
  const pathToUpload = `${pathToContent}/uploads`;

  // make sure the directory exists and we have enough permissions on it
  [pathToLogs, pathToUpload].forEach((dir) => {
    fs.mkdirpSync(dir);
    checkPermissions(dir);
  });

  // set paths in the configuration
  nconf.set(`paths`, {
    root: pathToRoot,
    content: pathToContent,
    logs: pathToLogs,
    upload: pathToUpload,
  });
})();

module.exports = nconf;
