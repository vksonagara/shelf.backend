const router = require("express").Router();
const { logger } = require("../logger");

router.get("/live", (req, res) => {
  logger.info("Sending Liveness check");
  res.send("Ok");
});

module.exports = router;
