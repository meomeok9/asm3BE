const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: "Products",
        },
        quan: { type: Number, require: true },
      },
    ],
    total: { type: Number, require: true },
    delivery: { type: String, require: true },
    state: { type: String, require: true },
    address: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
