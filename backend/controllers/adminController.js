const { User, Store, Rating } = require('../models');
const sequelize = require('../database');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ users, stores, ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dashboard failed' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sort='name', order='asc', page=1, limit=20 } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const offset = (page - 1) * limit;
    const rows = await User.findAll({ where, attributes: ['id','name','email','address','role'], order: [[sort, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']], limit: parseInt(limit,10), offset });
    res.json({ data: rows, page: parseInt(page,10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: 'Email exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password_hash, role });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sort='name', order='asc', page=1, limit=20 } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const offset = (page - 1) * limit;
    const rows = await Store.findAll({
      where,
      attributes: { include: [[sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE ratings.store_id = "Store".id)`), 'avgRating']] },
      order: [[sort, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
      limit: parseInt(limit,10), offset
    });
    res.json({ data: rows, page: parseInt(page,10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list stores' });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const store = await Store.create({ name, email, address, owner_id: owner_id || null });
    res.json({ id: store.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create store' });
  }
};
