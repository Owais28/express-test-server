const { Product, Variant } = require('../models');
const path = require('path')
const readFileLineByLine = require('./readFileLineByLine');

const SimpleQueue = require('../helpers/SimpleQueue');
const jsonlFilePath = path.resolve(__dirname, "../../large_products.jsonl")

async function migrateProducts() {
  await Product.sync({ force: true })
  await Variant.sync({ force: true })

  const queue = new SimpleQueue(10);
  const products = [];
  const variants = [];
  let processedLines = 0;

  readFileLineByLine(jsonlFilePath, async (line) => {
    const jsonData = JSON.parse(line);

    // Create product
    products.push({
      id: jsonData.id,
      title: jsonData.title,
      description: jsonData.description,
      vendor: jsonData.vendor,
    });

    // Create variants
    jsonData.variants.forEach((variantData) => {
      variants.push({
        id: variantData.id,
        variantTitle: variantData.variantTitle,
        price: variantData.price,
        availableQuantity: variantData.availableQuantity,
        availableForSale: variantData.availableForSale,
        variantPosition: variantData.variantPosition,
        productId: jsonData.id, // Associate variant with the product
      });
    });

    processedLines++;

    // Bulk insert every 5000 products and variants
    if (products.length >= 5000) {
      await queue.add(() => {
        bulkInsertProductsAndVariants(products, variants, processedLines);
      })
      products.length = 0;
      variants.length = 0;
    }
  })

  // Insert any remaining products and variants
  if (products.length > 0) {
    await queue.add(() => bulkInsertProductsAndVariants(products, variants, processedLines));
  }

  await queue.onIdle(); // Wait for all tasks to complete

  console.log('Migration completed successfully.');
}

async function bulkInsertProductsAndVariants(products, variants, processedLines) {
  // For debugging, log the progress less frequently
  if (processedLines % 5000 === 0) {
    console.log(`Processed ${processedLines} lines. Products: ${products.length}, Variants: ${variants.length}`);
  }

  // Insert into the database
  await Product.bulkCreate(products, {
    updateOnDuplicate: ['id'],
  });
  await Variant.bulkCreate(variants, {
    updateOnDuplicate: ["id"],
  });

}

migrateProducts();
