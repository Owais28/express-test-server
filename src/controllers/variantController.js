const { Variant } = require('../models/index');
const { v1: uuidv1 } = require('uuid')
exports.getVariants = async (req, res) => {
  try {

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const variants = await Variant.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json(variants);
  } catch (error) {
    console.error('Error getting variants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await Variant.findByPk(id);

    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.status(200).json(variant);
  } catch (error) {
    console.error('Error getting variant by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createVariant = async (req, res) => {
  try {
    // Extract variant data from the request body
    const { variantTitle, price, availableQuantity, availableForSale, variantPosition, productId } = req.body;


    let newVariant;
    let attempts = 0;
    do {

      // Generate a new ID
      const id = uuidv1();

      // Check if the generated ID already exists in the database
      const existingVariant = await Variant.findOne({ where: { id } });

      if (!existingVariant) {

        // Create a new variant in the database
        newVariant = await Variant.create({
          variantTitle,
          price,
          availableQuantity,
          availableForSale,
          variantPosition,
          productId,
          id
        });
      }

      attempts++;

      // Continue the loop until a unique ID is generated or maximum attempts reached
    } while (!newVariant && attempts > 0)

    res.status(201).json(newVariant);
  } catch (error) {
    console.error('Error creating variant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantTitle, price, availableQuantity, availableForSale, variantPosition } = req.body;

    const variant = await Variant.findByPk(id);

    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    // Update variant attributes
    variant.variantTitle = variantTitle;
    variant.price = price;
    variant.availableQuantity = availableQuantity;
    variant.availableForSale = availableForSale;
    variant.variantPosition = variantPosition;

    await variant.save();

    res.status(200).json(variant);
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await Variant.findByPk(id);

    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    await variant.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
