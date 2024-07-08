var express = require('express');
var router = express.Router();
const { addProduct, getAllProducts, getProductById } = require('../daos/product.js');

// Route to get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Route to add a new product
router.post('/', async (req, res, next) => {
  try {
    const newProduct = await addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Route to get a product by ID
router.get('/:productId', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;