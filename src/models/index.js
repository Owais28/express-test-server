const Sequelize = require('sequelize');
const dbConfig = require('../../sequelize.config'); // Adjust the import path based on your actual project structure

const sequelize = new Sequelize(dbConfig);

const Product = require('./Product')(sequelize);
const Variant = require('./Variant')(sequelize);

Product.beforeDestroy(async (product, options) => {
  await Variant.destroy({ where: { productId: product.id }, transaction: options.transaction });
})

// Define associations
// Product.hasMany(Variant, { foreignKey: 'productId' });
// Variant.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  Product,
  Variant,
};
