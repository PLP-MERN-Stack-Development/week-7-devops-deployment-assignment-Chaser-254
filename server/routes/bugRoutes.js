const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { db } = require('../database/database');
const { asyncHandler } = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation middleware
const validateBug = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be low, medium, high, or critical'),
  body('assignee')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Assignee name must be at least 2 characters'),
  body('reporter')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Reporter name must be at least 2 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const validateBugUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be low, medium, high, or critical'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Status must be open, in-progress, resolved, or closed'),
  body('assignee')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Assignee name must be at least 2 characters'),
  body('reporter')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Reporter name must be at least 2 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
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

// GET /api/bugs - Get all bugs with optional filtering
router.get('/', [
  query('status').optional().isIn(['open', 'in-progress', 'resolved', 'closed']),
  query('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  query('assignee').optional().trim(),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], asyncHandler(async (req, res) => {
  const { status, severity, assignee, search, page = 1, limit = 50 } = req.query;
  
  let bugs = db.getAllBugs();
  
  // Apply filters
  if (status) {
    bugs = bugs.filter(bug => bug.status === status);
  }
  
  if (severity) {
    bugs = bugs.filter(bug => bug.severity === severity);
  }
  
  if (assignee) {
    bugs = bugs.filter(bug => 
      bug.assignee.toLowerCase().includes(assignee.toLowerCase())
    );
  }
  
  if (search) {
    const searchTerm = search.toLowerCase();
    bugs = bugs.filter(bug =>
      bug.title.toLowerCase().includes(searchTerm) ||
      bug.description.toLowerCase().includes(searchTerm) ||
      bug.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // Sort by updatedAt (newest first)
  bugs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedBugs = bugs.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedBugs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: bugs.length,
      pages: Math.ceil(bugs.length / limit)
    }
  });
}));

// GET /api/bugs/stats - Get bug statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = db.getStats();
  
  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/bugs/:id - Get a specific bug
router.get('/:id', [
  param('id').notEmpty().withMessage('Bug ID is required')
], checkValidation, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const bug = db.getBugById(id);
  
  if (!bug) {
    throw new AppError(`Bug with ID ${id} not found`, 404);
  }
  
  res.json({
    success: true,
    data: bug
  });
}));

// POST /api/bugs - Create a new bug
router.post('/', validateBug, checkValidation, asyncHandler(async (req, res) => {
  const { title, description, severity, assignee, reporter, tags = [] } = req.body;
  
  // Sanitize and validate tags
  const sanitizedTags = tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => tag.trim())
    .slice(0, 5); // Limit to 5 tags
  
  const bugData = {
    title: title.trim(),
    description: description.trim(),
    severity,
    assignee: assignee.trim(),
    reporter: reporter.trim(),
    tags: sanitizedTags
  };
  
  const newBug = db.createBug(bugData);
  
  console.log(`✅ Bug created: ${newBug.id} - ${newBug.title}`);
  
  res.status(201).json({
    success: true,
    data: newBug,
    message: 'Bug created successfully'
  });
}));

// PUT /api/bugs/:id - Update a bug
router.put('/:id', [
  param('id').notEmpty().withMessage('Bug ID is required'),
  ...validateBugUpdate
], checkValidation, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Check if bug exists
  const existingBug = db.getBugById(id);
  if (!existingBug) {
    throw new AppError(`Bug with ID ${id} not found`, 404);
  }
  
  // Sanitize tags if provided
  if (updates.tags) {
    updates.tags = updates.tags
      .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
      .map(tag => tag.trim())
      .slice(0, 5);
  }
  
  // Trim string fields
  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'string') {
      updates[key] = updates[key].trim();
    }
  });
  
  const updatedBug = db.updateBug(id, updates);
  
  console.log(`📝 Bug updated: ${id} - ${updatedBug.title}`);
  
  res.json({
    success: true,
    data: updatedBug,
    message: 'Bug updated successfully'
  });
}));

// DELETE /api/bugs/:id - Delete a bug
router.delete('/:id', [
  param('id').notEmpty().withMessage('Bug ID is required')
], checkValidation, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const deleted = db.deleteBug(id);
  
  if (!deleted) {
    throw new AppError(`Bug with ID ${id} not found`, 404);
  }
  
  console.log(`🗑️ Bug deleted: ${id}`);
  
  res.json({
    success: true,
    message: 'Bug deleted successfully'
  });
}));

// DELETE /api/bugs - Clear all bugs (for testing)
router.delete('/', asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    throw new AppError('This operation is not allowed in production', 403);
  }
  
  db.clearAllBugs();
  
  console.log('🧹 All bugs cleared');
  
  res.json({
    success: true,
    message: 'All bugs cleared successfully'
  });
}));

module.exports = router;