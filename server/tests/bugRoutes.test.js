const request = require('supertest');
const app = require('../app');
const { db } = require('../database/database');

describe('Bug Routes', () => {
  beforeEach(() => {
    // Clear database before each test
    db.clearAllBugs();
  });

  describe('GET /api/bugs', () => {
    it('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all bugs', async () => {
      // Create test bugs
      const bug1 = db.createBug({
        title: 'Test Bug 1',
        description: 'This is a test bug description',
        severity: 'medium',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: ['test']
      });

      const bug2 = db.createBug({
        title: 'Test Bug 2',
        description: 'Another test bug description',
        severity: 'high',
        assignee: 'Mike Johnson',
        reporter: 'Sarah Wilson',
        tags: ['test', 'urgent']
      });

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Test Bug 2'); // Newest first
      expect(response.body.data[1].title).toBe('Test Bug 1');
    });

    it('should filter bugs by status', async () => {
      db.createBug({
        title: 'Open Bug',
        description: 'This is an open bug',
        severity: 'medium',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: []
      });

      const resolvedBug = db.createBug({
        title: 'Resolved Bug',
        description: 'This is a resolved bug',
        severity: 'low',
        assignee: 'Mike Johnson',
        reporter: 'Sarah Wilson',
        tags: []
      });

      // Update bug status to resolved
      db.updateBug(resolvedBug.id, { status: 'resolved' });

      const response = await request(app)
        .get('/api/bugs?status=resolved')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('resolved');
    });

    it('should search bugs by title and description', async () => {
      db.createBug({
        title: 'Login Issue',
        description: 'Users cannot login with special characters',
        severity: 'high',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: ['authentication']
      });

      db.createBug({
        title: 'Dashboard Problem',
        description: 'Dashboard loading slowly',
        severity: 'medium',
        assignee: 'Mike Johnson',
        reporter: 'Sarah Wilson',
        tags: ['performance']
      });

      const response = await request(app)
        .get('/api/bugs?search=login')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Login Issue');
    });
  });

  describe('GET /api/bugs/:id', () => {
    it('should return a specific bug', async () => {
      const bug = db.createBug({
        title: 'Test Bug',
        description: 'This is a test bug description',
        severity: 'medium',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: ['test']
      });

      const response = await request(app)
        .get(`/api/bugs/${bug.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(bug.id);
      expect(response.body.data.title).toBe('Test Bug');
    });

    it('should return 404 for non-existent bug', async () => {
      const response = await request(app)
        .get('/api/bugs/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('POST /api/bugs', () => {
    const validBugData = {
      title: 'Test Bug Title',
      description: 'This is a test bug description that is long enough',
      severity: 'medium',
      assignee: 'John Doe',
      reporter: 'Jane Smith',
      tags: ['test', 'bug']
    };

    it('should create a new bug with valid data', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send(validBugData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(validBugData.title);
      expect(response.body.data.status).toBe('open');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.message).toBe('Bug created successfully');
    });

    it('should return validation error for missing title', async () => {
      const invalidData = { ...validBugData };
      delete invalidData.title;

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return validation error for short title', async () => {
      const invalidData = { ...validBugData, title: 'Hi' };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details[0].msg).toContain('Title must be between');
    });

    it('should return validation error for invalid severity', async () => {
      const invalidData = { ...validBugData, severity: 'invalid' };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details[0].msg).toContain('Severity must be');
    });

    it('should limit tags to 5 items', async () => {
      const dataWithManyTags = {
        ...validBugData,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7']
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(dataWithManyTags)
        .expect(201);

      expect(response.body.data.tags).toHaveLength(5);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update an existing bug', async () => {
      const bug = db.createBug({
        title: 'Original Title',
        description: 'Original description that is long enough',
        severity: 'low',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: ['original']
      });

      const updateData = {
        title: 'Updated Title',
        severity: 'high',
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.severity).toBe('high');
      expect(response.body.data.status).toBe('in-progress');
      expect(response.body.message).toBe('Bug updated successfully');
    });

    it('should return 404 for non-existent bug', async () => {
      const response = await request(app)
        .put('/api/bugs/999')
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return validation error for invalid status', async () => {
      const bug = db.createBug({
        title: 'Test Bug',
        description: 'This is a test bug description',
        severity: 'medium',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: []
      });

      const response = await request(app)
        .put(`/api/bugs/${bug.id}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details[0].msg).toContain('Status must be');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete an existing bug', async () => {
      const bug = db.createBug({
        title: 'Bug to Delete',
        description: 'This bug will be deleted',
        severity: 'low',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: []
      });

      const response = await request(app)
        .delete(`/api/bugs/${bug.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug deleted successfully');

      // Verify bug is deleted
      const deletedBug = db.getBugById(bug.id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const response = await request(app)
        .delete('/api/bugs/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /api/bugs/stats', () => {
    it('should return bug statistics', async () => {
      // Create bugs with different statuses and severities
      db.createBug({
        title: 'Open Bug 1',
        description: 'Description',
        severity: 'high',
        assignee: 'John',
        reporter: 'Jane',
        tags: []
      });

      const bug2 = db.createBug({
        title: 'Bug 2',
        description: 'Description',
        severity: 'medium',
        assignee: 'John',
        reporter: 'Jane',
        tags: []
      });

      db.updateBug(bug2.id, { status: 'resolved' });

      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.open).toBe(1);
      expect(response.body.data.resolved).toBe(1);
      expect(response.body.data.severityStats.high).toBe(1);
      expect(response.body.data.severityStats.medium).toBe(1);
    });
  });
});