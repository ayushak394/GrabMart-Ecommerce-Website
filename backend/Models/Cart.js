const mongoose = require("mongoose"); // Helps interact with MongoDB

const CartSchema = new mongoose.Schema({
  // creates a new Schema
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 1) mongoose.Schema.Types.ObjectId -> Extracts or Stores the unique identifiers of a refrenced document from another collection. 2) ref helps establish a relation between the Cart and User collection using the modelname in module.exports.
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
