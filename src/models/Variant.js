const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Variant = sequelize.define('Variant', {
    id: {
      type: DataTypes.BIGINT,
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
  });

  return Variant;
};
