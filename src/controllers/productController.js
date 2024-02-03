const { Product, Variant } = require('../models/index'); // Assuming you have a Product model
const { v1: uuidv1 } = require("uuid")

const getProductVaraints = async (products) => {

  const JSONifiedProducts = JSON.stringify(products)
  const parsedProducts = JSON.parse(JSONifiedProducts)

  const result = await Promise.all(parsedProducts.map(async (product) => {
    const newProduct = { ...product }; // Make a shallow copy to avoid modifying the original object
    const variants = await Variant.findAll({ where: { productId: product.id } });
    newProduct.variants = JSON.parse(JSON.stringify(variants));
    return newProduct;
  }));

  return result;
}

const getProductByIdVariants = async (product) => {
  const parsedProduct = JSON.parse(JSON.stringify(product))

  const variants = await Variant.findAll({ where: { productId: parsedProduct.id } })
  parsedProduct.variants = JSON.parse(JSON.stringify(variants));

  return parsedProduct
}

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25; // Return 100 products by default
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      offset,
      limit,
    });

    // const productsWithVariants = await getProductVaraints(products)
    // console.log("Result", await getProductVaraints(products))

    res.json({ success: true, data: await getProductVaraints(products) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// get a specific product by ID
exports.getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    // Fetch the product by ID from the database
    const product = await Product.findByPk(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Send the product as a JSON response
    res.json({ success: true, data: await getProductByIdVariants(product) });
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Helper function to generate a product handle from the title
function generateProductHandle(title) {
  // Implement your logic to generate a handle (e.g., lowercase and replace spaces with dashes)
  const handle = title.toLowerCase().replace(/\s+/g, '-');
  return handle;
}

// Helper function to format the product title
function formatProductTitle(title) {
  const formattedTitle = title.replace(/-/g, ' ');
  return formattedTitle
}

exports.getProductByTitle = async (req, res) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({ error: 'Product title is required' });
    }

    // Transform the provided format to the desired format
    const formattedTitle = formatProductTitle(title);

    const product = await Product.findOne({ where: { queryableTitle: formattedTitle } });

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

    let newProduct;
    let attempts = 0;

    do {
      // Generate a new ID
      const id = uuidv1();

      // Check if the generated ID already exists in the database
      const existingProduct = await Product.findOne({ where: { id } });

      if (!existingProduct) {
        // If the ID is unique, create a new product
        newProduct = await Product.create({
          id,
          title,
          description,
          vendor,
        });
      }

      attempts++;

      // Continue the loop until a unique ID is generated or maximum attempts reached
    } while (!newProduct && attempts > 0);

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
    const productId = req.params.id;

    // Check if the product with the given ID exists
    const existingProduct = await Product.findByPk(productId)
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
    const productId = req.params.id;

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
