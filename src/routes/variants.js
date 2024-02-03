const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/VariantController');

// GET all variants
router.get('/', VariantController.getVariants);

// GET variant by ID
router.get('/:id', VariantController.getVariantById);

// POST create a new variant
router.post('/', VariantController.createVariant);

// PUT update a variant
router.put('/:id', VariantController.updateVariantct);

// DELETE a variant
router.delete('/:id', VariantController.deleteVariant);

module.exports = router;
