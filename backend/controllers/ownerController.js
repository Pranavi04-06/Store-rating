const { Store, Rating, User } = require('../models');
const sequelize = require('../database');

exports.myStores = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: { include: [[sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE ratings.store_id = "Store".id)`), 'avgRating']] }
    });
    res.json({ data: stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get owner stores' });
  }
};

exports.storeRaters = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = parseInt(req.params.id, 10);
    const store = await Store.findOne({ where: { id: storeId, owner_id: ownerId } });
    if (!store) return res.status(404).json({ message: 'Store not found or not owned by you' });

    const raters = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, attributes: ['id','name','email','address'] }],
      order: [['created_at','DESC']]
    });
    res.json({ data: raters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get raters' });
  }
};
