const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories
} = require('../controllers/productController');

// All products with filtering (category, search, sort)
router.get('/', getProducts);

// Categories
router.get('/categories', getCategories);

// Single Product
router.get('/:id', getProductById);

module.exports = router;
