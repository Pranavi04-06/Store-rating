// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// ----------------------
// Sequelize Initialization
// ----------------------
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false
});

// ----------------------
// Models
// ----------------------
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

// ----------------------
// Associations
// ----------------------
User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

User.hasMany(Rating, { foreignKey: 'user_id', as: 'user_ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ----------------------
// Routes
// ----------------------

// Users
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stores
app.get('/stores', async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
    });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stores with ratings
app.get('/stores-with-ratings', async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: [
        'id', 'name', 'location', 'owner_id', 'image_url', 'category', 'contact', 'description',
        [sequelize.fn('AVG', sequelize.col('ratings.rating')), 'average_rating'],
        [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'total_ratings']
      ],
      include: [
        { model: Rating, as: 'ratings', attributes: [] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ],
      group: ['Store.id', 'owner.id'],
      order: [[sequelize.literal('average_rating'), 'DESC']]
    });

    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores with ratings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ratings
app.get('/ratings', async (req, res) => {
  const ratings = await Rating.findAll();
  res.json(ratings);
});

app.post('/ratings', async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/ratings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const existing = await Rating.findByPk(id);
    if (!existing) return res.status(404).json({ error: "Rating not found" });

    existing.rating = rating;
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");
    await sequelize.sync(); // sync tables
    console.log("✅ All models synced!");
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
});








