// seed.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// DB connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false
});

// Models
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('NORMAL_USER'), defaultValue: 'NORMAL_USER' }
}, { tableName: 'users', timestamps: false });

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  owner_id: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
}, { tableName: 'stores', timestamps: false });

const Rating = sequelize.define('Rating', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  store_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'ratings', timestamps: false });

// Associations
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // Force sync tables (drops & recreates tables)
    await sequelize.sync({ force: true });
    console.log("✅ All tables synced!");

    // Insert sample users
    const users = await User.bulkCreate([
      { name: "Alice", email: "alice@example.com", password: "1234" },
      { name: "Bob", email: "bob@example.com", password: "1234" },
      { name: "Charlie", email: "charlie@example.com", password: "1234" }
    ]);

    // Insert sample stores
    const stores = await Store.bulkCreate([
      { name: "Grocery Hub", location: "City Center", owner_id: users[0].id, category: "Grocery", contact: "1234567890", description: "Best groceries in town", image_url: "https://via.placeholder.com/150" },
      { name: "Tech World", location: "Market Street", owner_id: users[1].id, category: "Electronics", contact: "9876543210", description: "Latest gadgets and electronics", image_url: "https://via.placeholder.com/150" },
      { name: "Book Haven", location: "Library Road", owner_id: users[2].id, category: "Books", contact: "5555555555", description: "All kinds of books available", image_url: "https://via.placeholder.com/150" },
      { name: "Cloth Hub", location: "main City ", owner_id: users[3].id, category: "cloth", contact: "1234567890", description: "Best groceries in town", image_url: "https://via.placeholder.com/150" },
      { name: "technology World", location: "Market Street", owner_id: users[4].id, category: "Electronics", contact: "9876543210", description: "Latest gadgets and electronics", image_url: "https://via.placeholder.com/150" },
      { name: "Book House", location: "Library Road", owner_id: users[5].id, category: "Books", contact: "5555555555", description: "All kinds of books available", image_url: "https://via.placeholder.com/150" }
    
    ]);

    // Insert sample ratings
    await Rating.bulkCreate([
      { user_id: users[0].id, store_id: stores[1].id, rating: 5 },
      { user_id: users[1].id, store_id: stores[0].id, rating: 4 },
      { user_id: users[2].id, store_id: stores[0].id, rating: 3 },
      { user_id: users[0].id, store_id: stores[2].id, rating: 4 }
    ]);

    console.log("✅ Sample data inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
