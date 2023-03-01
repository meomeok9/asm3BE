const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, require: true },
  email: { type: String, require: true },
  passWord: { type: String, require: true },
  phoneNumber: { type: String, require: true },
  address: { type: String, require: false },
  role: { type: String, require: true },
});

module.exports = mongoose.model("User", userSchema);
