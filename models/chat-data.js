const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    message: { type: Array, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatDatas", chatSchema);
