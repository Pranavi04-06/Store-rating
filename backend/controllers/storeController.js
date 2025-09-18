const { Op, literal } = require('sequelize');
const { Store, Rating } = require('../models');
const sequelize = require('../database');

exports.listStores = async (req, res) => {
  try {
    const q = (req.query.search || '').trim();
    const sort = req.query.sort || 'name';
    const order = (req.query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    const where = {};
    if (q) where[Op.or] = [{ name: { [Op.iLike]: `%${q}%` } }, { address: { [Op.iLike]: `%${q}%` } }];

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [
          [sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE ratings.store_id = "Store".id)`), 'avgRating'],
          [sequelize.literal(`(SELECT rating FROM ratings WHERE ratings.store_id = "Store".id AND ratings.user_id = ${req.user ? req.user.id : 0})`), 'yourRating']
        ]
      },
      order: [[sort, order]],
      limit, offset
    });
    res.json({ data: stores, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list stores' });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      attributes: {
        include: [
          [sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE ratings.store_id = "Store".id)`), 'avgRating']
        ]
      }
    });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get store' });
  }
};

exports.submitOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);
    const { rating } = req.body;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5' });

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated', rating: existing.rating });
    } else {
      const r = await Rating.create({ user_id: userId, store_id: storeId, rating });
      return res.json({ message: 'Rating submitted', rating: r.rating });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
};
