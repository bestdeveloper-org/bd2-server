const jwt = require("koa-jwt");
const SECRET = "S3cRET~!";
const jwtInstance = jwt({secret: SECRET});

module.exports = jwtInstance;