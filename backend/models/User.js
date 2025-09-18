// models/index.js
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Import model definitions (functions)
const UserModel = require("./User");
const StoreModel = require("./Store");
const RatingModel = require("./Rating");

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Store = StoreModel(sequelize, DataTypes);
const Rating = RatingModel(sequelize, DataTypes);

// Associations
Store.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
User.hasMany(Store, { foreignKey: "owner_id", as: "stores" });

Store.hasMany(Rating, { foreignKey: "store_id", as: "Ratings" });
Rating.belongsTo(Store, { foreignKey: "store_id", as: "Store" });

module.exports = { sequelize, User, Store, Rating };
