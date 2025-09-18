// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ✅ FIX: Replace the placeholder with the actual authenticate function
exports.authenticate = async (req, res, next) => {
  let token;
  
  // Check for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token and attach it to the request
      req.user = await User.findByPk(decoded.id, {
        // Don't include the password in the user object
        attributes: { exclude: ['password'] }
      });
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// Your 'isAdmin' middleware (this part is correct)
exports.isAdmin = (req, res, next) => {
  // This middleware should run AFTER the 'authenticate' middleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};