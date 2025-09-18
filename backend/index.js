// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());

// Import sequelize instance and models
const sequelize = require('./sequelize'); // your file name where you wrote the code above
const { DataTypes } = require('sequelize');

// ----------------------
// Models
// ----------------------
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('NORMAL_USER'), defaultValue: 'NORMAL_USER' },
}, { tableName: 'users', timestamps: false });

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  owner_id: { type: DataTypes.INTEGER },

  // 🆕 Extra fields for better UI
  image_url: { type: DataTypes.STRING },       // store image
  category: { type: DataTypes.STRING },        // e.g. Restaurant, Electronics
  contact: { type: DataTypes.STRING },         // phone or email
  description: { type: DataTypes.TEXT },       // about the store
}, { tableName: 'stores', timestamps: false });

const Rating = sequelize.define('Rating', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  store_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'ratings', timestamps: false });

// Middleware
app.use(express.json());

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

// Stores
app.get('/stores', async (req, res) => {
  const stores = await Store.findAll();
  res.json(stores);
});
app.post('/stores', async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ratings
app.get('/ratings', async (req, res) => {
  const ratings = await Rating.findAll();
  res.json(ratings);
});
app.post('/ratings', async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update rating (PUT)
app.put('/ratings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const existing = await Rating.findByPk(id);

    if (!existing) {
      return res.status(404).json({ error: "Rating not found" });
    }

    existing.rating = rating;
    await existing.save();

    res.json(existing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // This will create tables if they don’t exist
    await sequelize.sync({ alter: true }); 
    console.log("✅ All models synced!");

    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
  }
});

// Get all stores with average ratings
app.get('/stores-with-ratings', async (req, res) => {
  console.log("Inside stores-with-ratings");
  try {
    const stores = await Store.findAll({
      attributes: [
        'id',
        'name',
        'location',
        'owner_id',
        'image_url',
        'category',
        'contact',
        'description',
        // Sequelize aggregate for avg rating
        [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'average_rating'],
        [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'total_ratings']
      ],
      include: [
        {
          model: Rating,
          attributes: []
        }
      ],
      group: ['Store.id']
    });

    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores with ratings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ✅ Add this route
app.get('/stores-with-ratings', async (req, res) => {
  console.log("Inside stores-with-ratings");
  try {
    const stores = await Store.findAll({
      attributes: [
        "id",
        "name",
        "location",
        "owner_id",
        "image_url",
        "category",
        "contact",
        "description",
        [sequelize.fn("AVG", sequelize.col("Ratings.rating")), "average_rating"],
        [sequelize.fn("COUNT", sequelize.col("Ratings.id")), "total_ratings"]
      ],
      include: [
        { model: Rating, as: "Ratings", attributes: [] },
        { model: User, as: "owner", attributes: ["id", "username", "email", "role"] }
      ],
      group: ["Store.id", "owner.id"],
      order: [[sequelize.literal("average_rating"), "DESC"]]
    });

    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores with ratings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});






