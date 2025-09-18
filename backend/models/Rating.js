module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("Rating", {
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    store_id: DataTypes.INTEGER,
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Store, { foreignKey: "store_id", as: "store" });
  };

  return Rating;
};


