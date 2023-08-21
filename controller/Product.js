const Product = require("../models/Product");

const handleError = (error, res) => {
  console.error(error);
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = {
  async index(req, res) {
    try {
      const products = await Product.find().sort({ category: 1 });

      if (!products.length) {
        return res.status(401).json({ message: "No products" });
      }

      return res.status(200).json({ message: "Successful", products });
    } catch (error) {
      return handleError(error, res);
    }
  },

  async add(req, res) {
    try {
      const product = new Product(req.body);
      const savedProduct = await product.save();
      res.status(200).send(savedProduct);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const { _id } = req.params;
      const product = await Product.findOneAndUpdate({ _id }, req.body, { new: true });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      return handleError(error, res);
    }
  },

  async remove(req, res) {
    try {
      const { _id } = req.params;
      const product = await Product.findOneAndDelete({ _id });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return handleError(error, res);
    }
  },
};
