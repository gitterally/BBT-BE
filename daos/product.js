// BBT-BE/daos/product.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productType: { type: String, required: true },
    productComponents: [{ componentName: String, componentPrice: Number }],
    productToppings: [{ toppingName: String, toppingPrice: Number }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

// Add a new product
async function addProduct(productData) {
  const product = new Product(productData);
  await product.save();
  return product;
}

// Get all products
async function getAllProducts() {
  return await Product.find({});
}

// Find a product by ID
async function getProductById(productId) {
  return await Product.findById(productId);
}

module.exports = { addProduct, getAllProducts, getProductById };