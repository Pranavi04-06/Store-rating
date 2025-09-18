// models/Store.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  owner_id: { type: DataTypes.INTEGER },

  // Extra fields
  image_url: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
}, { 
  tableName: 'stores',
  timestamps: false 
});

module.exports = Store;




