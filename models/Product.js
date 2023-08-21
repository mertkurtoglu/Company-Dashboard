const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
  company: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema, "products");
