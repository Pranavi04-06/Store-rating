module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define("Store", {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    owner_id: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    category: DataTypes.STRING,
    contact: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

  Store.associate = (models) => {
    Store.hasMany(models.Rating, { foreignKey: "store_id", as: "ratings" });
  };

  return Store;
};





