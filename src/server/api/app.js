const router = require("express").Router();
const {
  handleResourceNotFountError,
  handleJSONResponse,
} = require("../middlewares/errorHandler");
const api = require("../api");

router.get("/live", api.http(api.AppStatusAPI.getLiveStatus));

// User APIs
router.post("/users/signup", api.http(api.UserApi.signup));
router.post("/users/verify-email", api.http(api.UserApi.verifyEmail));

// Middleware to handle not found error and other errors
router.use(handleResourceNotFountError);
router.use(handleJSONResponse);

module.exports = router;
