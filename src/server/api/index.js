const _ = require("lodash");
const AppStatusAPI = require("./AppStatusApi");
const UserApi = require("./UserApi");
const FolderApi = require("./FolderApi");
const NoteApi = require("./NoteApi");

const http = function http(apiMethod) {
  return async function apiHandler(req, res, next) {
    const object = req.body;
    const requestKeys = [
      "file",
      "files",
      "headers",
      "params",
      "query",
      "cookies",
    ];

    const options = {
      ..._.pick(req, requestKeys),
      user: req.user ? req.user : null,
    };

    try {
      const response = await apiMethod(object, options);

      if (req.method === "DELETE") {
        // if response isn't empty then send 200
        if (response) {
          return res.status(200).send(response);
        }
        return res.status(204).end();
      }

      // const contentType = res.get("Content-Type");
      // Add conditions for other content types

      // api method response wants to handle the express response
      // example: serve files (stream)
      if (_.isFunction(response)) {
        return response(req, res, next);
      }

      // Send json response
      res.json(response || {});
    } catch (err) {
      // To be handled by the API middleware
      next(err);
    }
  };
};

module.exports = {
  http,
  AppStatusAPI,
  UserApi,
  FolderApi,
  NoteApi
};
