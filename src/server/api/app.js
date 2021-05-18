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
router.post("/users/sign-in", api.http(api.UserApi.signIn));
router.get("/users/refresh", api.http(api.UserApi.refreshAccessToken));
router.post("/users/sign-out", api.http(api.UserApi.signOut));

// Middleware to handle not found error and other errors
router.use(handleResourceNotFountError);
router.use(handleJSONResponse);

module.exports = router;
