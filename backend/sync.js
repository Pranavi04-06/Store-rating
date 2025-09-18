require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store } = require('./models');

async function seed() {
  await sequelize.sync({ alter: true });
  console.log('DB synced');

  const adminEmail = 'admin@example.com';
  const existing = await User.findOne({ where: { email: adminEmail }});
  if (!existing) {
    const hash = await bcrypt.hash('Admin@123', 10);
    await User.create({ name: 'System Administrator', email: adminEmail, address: 'HQ', password_hash: hash, role: 'SYSTEM_ADMIN' });
    console.log('Created admin: admin@example.com / Admin@123');
  }

  await Store.findOrCreate({ where: { name: 'Coffee Corner'}, defaults: { email: 'cc@example.com', address: 'MG Road' }});
  await Store.findOrCreate({ where: { name: 'Book Nook'}, defaults: { email: 'bk@example.com', address: '5th Avenue' }});
  console.log('Sample stores created');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
