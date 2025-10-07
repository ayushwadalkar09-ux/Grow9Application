// middleware/seedAdmin.js
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });

    if (existingAdmin) {
      console.log('✅ Default Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new Admin({
      username: 'Admin',
      password: hashedPassword,
    });

    await Admin.updateOne(
      { username: process.env.ADMIN_USERNAME },
      { $setOnInsert: { username: process.env.ADMIN_USERNAME, password: hashedPassword } },
      { upsert: true }
    );
    console.log('🚀 Admin created');
  } catch (error) {
    console.error('❌ Error while creating Admin:', error.message);
  }
};

module.exports = seedAdmin;
