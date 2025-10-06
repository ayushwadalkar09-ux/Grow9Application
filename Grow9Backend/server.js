// // server.js
// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// // Middleware
// app.use(cors());
// app.use(express.json());

// // In-memory database (Replace with actual database in production)
// const admins = [
//   {
//     id: 1,
//     username: 'admin',
//     password: '$2b$10$Xirhj/sMmV5gqe38WTvrQOZBlLYEVOJMARNA0cU/0FN.jZRoFLSmO' // "admin123"
//   }
// ];

// const sponsors = [
//   {
//     id: 1,
//     sponsorId: 'SP001',
//     username: 'sponsor1',
//     password: '$2b$10$gejiaU1VRGKm6usQ/97xDOw/OXFQedE1rAZynI04DTU/mVXwuY3NK' // "sponsor123"
//   }
// ];

// // Helper function to generate JWT token
// const generateToken = (user, type) => {
//   const payload = {
//     id: user.id,
//     username: user.username,
//     type: type,
//     ...(type === 'sponsor' && { sponsorId: user.sponsorId })
//   };

//   return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
// };

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token required' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Admin Login Route
// app.post('/api/Admin/login', async (req, res) => {
//   try {
//     console.log("Enter"+ req+"for Login" + req)
//     const { username, password } = req.body;
//     // Validate input
//     if (!username || !password) {
//       return res.status(400).json({ 
//         message: 'Username and password are required' 
//       });
//     }
//     console.log("Enter for Login 1")
//     // Find admin by username
//     const admin = admins.find(a => a.username === username);
//     console.log("Admin"+admin);
//     if (!admin) {
//       return res.status(401).json({ 
//         message: 'Invalid admin credentials' 
//       });
//     }
//     console.log("Enter for Login 2")
//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     console.log("Enter for Login 3")
//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         message: 'Invalid admin credentials' 
//       });
//     }
//     console.log("Enter for Login 4")
//     // Generate JWT token
//     const token = generateToken(admin, 'admin');

//     res.status(200).json({
//       message: 'Login successful',
//       token: token,
//       user: {
//         id: admin.id,
//         username: admin.username,
//         type: 'admin'
//       }
//     });

//   } catch (error) {
//     console.error('Admin login error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error' 
//     });
//   }
// });

// // Sponsor Login Route
// app.post('/api/sponser/login', async (req, res) => {
//   try {
//     const { sponsorId, username, password } = req.body;

//     // Validate input
//     if (!sponsorId || !username || !password) {
//       return res.status(400).json({ 
//         message: 'Sponsor ID, username, and password are required' 
//       });
//     }

//     // Find sponsor by sponsorId and username
//     const sponsor = sponsors.find(
//       s => s.sponsorId === sponsorId && s.username === username
//     );

//     if (!sponsor) {
//       return res.status(401).json({ 
//         message: 'Invalid sponsor credentials' 
//       });
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, sponsor.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         message: 'Invalid sponsor credentials' 
//       });
//     }

//     // Generate JWT token
//     const token = generateToken(sponsor, 'sponsor');

//     res.status(200).json({
//       message: 'Login successful',
//       token: token,
//       user: {
//         id: sponsor.id,
//         sponsorId: sponsor.sponsorId,
//         username: sponsor.username,
//         type: 'sponsor'
//       }
//     });

//   } catch (error) {
//     console.error('Sponsor login error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error' 
//     });
//   }
// });

// // Protected route example - Verify token
// app.get('/api/verify-token', authenticateToken, (req, res) => {
//   res.status(200).json({
//     message: 'Token is valid',
//     user: req.user
//   });
// });

// // Admin protected route example
// app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
//   if (req.user.type !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }

//   res.status(200).json({
//     message: 'Welcome to admin dashboard',
//     data: {
//       // Your admin dashboard data
//     }
//   });
// });

// // Sponsor protected route example
// app.get('/api/sponsor/dashboard', authenticateToken, (req, res) => {
//   if (req.user.type !== 'sponsor') {
//     return res.status(403).json({ message: 'Sponsor access required' });
//   }

//   res.status(200).json({
//     message: 'Welcome to sponsor dashboard',
//     data: {
//       // Your sponsor dashboard data
//     }
//   });
// });

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'OK', message: 'Server is running' });
// });




// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`Admin login endpoint: http://localhost:${PORT}/api/Admin/login`);
//   console.log(`Sponsor login endpoint: http://localhost:${PORT}/api/sponser/login`);
// });

// // Utility function to hash passwords (use this to create hashed passwords)
// async function hashPassword(password) {
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   console.log('Hashed password:', hashedPassword);
//   return hashedPassword;
// }

// // Uncomment to generate hashed passwords
// // hashPassword('admin123');
// // hashPassword('sponsor123');


// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const adminRoutes = require('./routes/adminRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');

const app = express();
app.use(cors());
app.use(express.json());

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
