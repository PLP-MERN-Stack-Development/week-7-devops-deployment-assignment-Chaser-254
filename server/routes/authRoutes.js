const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/database');
const { asyncHandler } = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation middleware
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// POST /api/auth/register - Register a new user
router.post('/register', validateRegister, checkValidation, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }
  
  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Create user
  const userData = {
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'user'
  };
  
  const newUser = db.createUser(userData);
  
  // Generate token
  const token = generateToken(newUser.id);
  
  // Remove password from response
  const { password: _, ...userResponse } = newUser;
  
  console.log(`👤 User registered: ${newUser.email}`);
  
  res.status(201).json({
    success: true,
    data: {
      user: userResponse,
      token
    },
    message: 'User registered successfully'
  });
}));

// POST /api/auth/login - Login user
router.post('/login', validateLogin, checkValidation, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = db.getUserByEmail(email.toLowerCase());
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Generate token
  const token = generateToken(user.id);
  
  // Remove password from response
  const { password: _, ...userResponse } = user;
  
  console.log(`🔐 User logged in: ${user.email}`);
  
  res.json({
    success: true,
    data: {
      user: userResponse,
      token
    },
    message: 'Login successful'
  });
}));

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', asyncHandler(async (req, res) => {
  // This would typically use authentication middleware
  // For now, return a mock response
  res.json({
    success: true,
    data: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user'
    }
  });
}));

module.exports = router;