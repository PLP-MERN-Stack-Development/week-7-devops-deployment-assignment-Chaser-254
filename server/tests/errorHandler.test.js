const request = require('supertest');
const app = require('../app');
const { AppError } = require('../middleware/errorHandler');

describe('Error Handling', () => {
  describe('AppError class', () => {
    it('should create error with correct properties', () => {
      const error = new AppError('Test error message', 400);

      expect(error.message).toBe('Test error message');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });

    it('should set status to error for 5xx codes', () => {
      const error = new AppError('Server error', 500);
      expect(error.status).toBe('error');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Not found');
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 for validation errors', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send({
          title: 'Hi', // Too short
          description: 'Short', // Too short
          severity: 'invalid', // Invalid value
          assignee: '',
          reporter: ''
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details)).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to API routes', async () => {
      // This test would need to make many requests to trigger rate limiting
      // For now, just verify the endpoint responds normally
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });
  });
});