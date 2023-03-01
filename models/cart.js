const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Products",
      },
      price: { type: Number, require: true },
      quan: { type: Number, require: true },
    },
  ],
});

module.exports = mongoose.model("Carts", cartSchema);
