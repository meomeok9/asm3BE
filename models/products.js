const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  name: { type: String, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true },
  inventory: { type: Number, require: true }, // hàng tồn kho
  short_desc: { type: String, require: true },
  long_desc: { type: String, require: true },
  img1: { type: String, require: true },
  img2: { type: String, require: true },
  img3: { type: String, require: true },
  img4: { type: String, require: true },
});
module.exports = mongoose.model("Products", productsSchema);
