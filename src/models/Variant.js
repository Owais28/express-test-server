const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Variant = sequelize.define('Variant', {
    id: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    variantTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableForSale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    variantPosition: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      default: DataTypes.UUIDV1,
      allowNull: false,
    }
  });

  return Variant;
};
