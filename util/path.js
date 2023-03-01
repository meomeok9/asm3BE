const path = require("path");

module.exports = path.dirname(require.main.filename); // before process.mainModule.filename
