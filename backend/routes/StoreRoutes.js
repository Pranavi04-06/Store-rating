const express = require("express");
const router = express.Router();
const { sequelize, Store, Rating, User } = require("../models");

router.get("/stores-with-ratings", async (req, res) => {
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

module.exports = router;
