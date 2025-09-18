// sequelize.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD), // Ensure password is a string
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('DB auth OK'))
  .catch(err => console.error('Failed to connect or sync:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('All models synced successfully.'))
  .catch(err => console.error('Failed to connect or sync:', err));

module.exports = sequelize; // ✅ export the instance
