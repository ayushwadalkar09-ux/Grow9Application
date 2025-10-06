const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

exports.generateToken = (user, type) => {
  const payload = {
    id: user.id,
    username: user.username,
    type,
    ...(type === 'sponsor' && { sponsorId: user.sponsorId }),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
