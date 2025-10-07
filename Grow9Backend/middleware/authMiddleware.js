const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports. authenticateToken = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    token = JSON.parse(token);
    token = token.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }      
      req.user = decoded; // Attach decoded token payload to request
      next();
    });
  };
