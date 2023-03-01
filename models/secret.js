const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const secretSchema = new Schema({});

module.exports = mongoose.model("secret", secretSchema);
