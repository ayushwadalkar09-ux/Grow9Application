// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedAdmin = require('./middleware/seedAdmin');

dotenv.config();

const adminRoutes = require('./routes/adminRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(()=>{
  seedAdmin();
});

// Routes
app.use('/api/Admin', adminRoutes);
app.use('/api/sponser', sponsorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
