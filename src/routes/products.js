const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// GET all products
router.get('/', ProductController.getProducts);

// GET product by ID
router.get('/:id', ProductController.getProductById);

// POST create a new product
router.post('/', ProductController.createProduct);

// PUT update a product
router.put('/:id', ProductController.updateProduct);

// DELETE a product
router.delete('/:id', ProductController.deleteProduct);

// GET product by title
router.get('/:title', ProductController.getProductByTitle);

module.exports = router;
