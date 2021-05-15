global.Promise = require("bluebird");
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Calcutta");

require("./server/config");
require("./server/app");
