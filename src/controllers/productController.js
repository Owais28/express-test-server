const Product = require('../models/Product'); // Assuming you have a Product model

exports.getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.findAll();

    // Send the products as a JSON response
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get a specific product by ID
exports.getProductById = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Fetch the product by ID from the database
    const product = await Product.findByPk(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Send the product as a JSON response
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductByTitle = async (req, res) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({ error: 'Product title is required' });
    }

    const product = await Product.findOne({ where: { title } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// create a new product
exports.createProduct = async (req, res) => {
  try {
    // Extract product data from the request body
    const { title, description, vendor } = req.body;

    // Create a new product in the database
    const newProduct = await Product.create({
      title,
      description,
      vendor,
    });

    // Send the newly created product as a JSON response
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// update a product
exports.updateProduct = async (req, res) => {
  try {
    // Extract product data from the request body
    const { title, description, vendor } = req.body;
    const productId = req.params.productId;

    // Check if the product with the given ID exists
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product with the new data
    await existingProduct.update({
      title,
      description,
      vendor,
    });

    // Send the updated product as a JSON response
    res.json(existingProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Extract product ID from the request parameters
    const productId = req.params.productId;

    // Check if the product with the given ID exists
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product
    await existingProduct.destroy();

    // Send a success message as a JSON response
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
