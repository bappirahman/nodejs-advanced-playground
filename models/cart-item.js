const { DataTypes } = require("sequelize");
const Product = require("./product");

const sequelize = require("../util/database");

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: DataTypes.INTEGER.UNSIGNED,
});

module.exports = CartItem;
