const { db } = require('../database/database');

describe('Database Operations', () => {
  beforeEach(() => {
    // Clear database before each test
    db.clearAllBugs();
  });

  describe('Bug CRUD Operations', () => {
    const sampleBugData = {
      title: 'Test Bug',
      description: 'This is a test bug description',
      severity: 'medium',
      assignee: 'John Doe',
      reporter: 'Jane Smith',
      tags: ['test', 'bug']
    };

    describe('createBug', () => {
      it('should create a new bug with correct properties', () => {
        const bug = db.createBug(sampleBugData);

        expect(bug.id).toBeDefined();
        expect(bug.title).toBe(sampleBugData.title);
        expect(bug.description).toBe(sampleBugData.description);
        expect(bug.severity).toBe(sampleBugData.severity);
        expect(bug.assignee).toBe(sampleBugData.assignee);
        expect(bug.reporter).toBe(sampleBugData.reporter);
        expect(bug.tags).toEqual(sampleBugData.tags);
        expect(bug.status).toBe('open');
        expect(bug.createdAt).toBeInstanceOf(Date);
        expect(bug.updatedAt).toBeInstanceOf(Date);
      });

      it('should assign incremental IDs', () => {
        const bug1 = db.createBug(sampleBugData);
        const bug2 = db.createBug(sampleBugData);

        expect(parseInt(bug2.id)).toBe(parseInt(bug1.id) + 1);
      });
    });

    describe('getAllBugs', () => {
      it('should return empty array when no bugs exist', () => {
        const bugs = db.getAllBugs();
        expect(bugs).toEqual([]);
      });

      it('should return all bugs with correct date objects', () => {
        const bug1 = db.createBug(sampleBugData);
        const bug2 = db.createBug({ ...sampleBugData, title: 'Second Bug' });

        const bugs = db.getAllBugs();

        expect(bugs).toHaveLength(2);
        expect(bugs[0].createdAt).toBeInstanceOf(Date);
        expect(bugs[0].updatedAt).toBeInstanceOf(Date);
        expect(bugs[1].createdAt).toBeInstanceOf(Date);
        expect(bugs[1].updatedAt).toBeInstanceOf(Date);
      });
    });

    describe('getBugById', () => {
      it('should return bug with correct ID', () => {
        const createdBug = db.createBug(sampleBugData);
        const retrievedBug = db.getBugById(createdBug.id);

        expect(retrievedBug).toBeDefined();
        expect(retrievedBug.id).toBe(createdBug.id);
        expect(retrievedBug.title).toBe(sampleBugData.title);
      });

      it('should return null for non-existent ID', () => {
        const bug = db.getBugById('999');
        expect(bug).toBeNull();
      });
    });

    describe('updateBug', () => {
      it('should update bug properties correctly', () => {
        const bug = db.createBug(sampleBugData);
        const originalUpdatedAt = bug.updatedAt;

        // Wait a bit to ensure different timestamp
        setTimeout(() => {
          const updates = {
            title: 'Updated Title',
            status: 'in-progress',
            severity: 'high'
          };

          const updatedBug = db.updateBug(bug.id, updates);

          expect(updatedBug.title).toBe('Updated Title');
          expect(updatedBug.status).toBe('in-progress');
          expect(updatedBug.severity).toBe('high');
          expect(updatedBug.description).toBe(sampleBugData.description); // Unchanged
          expect(updatedBug.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        }, 10);
      });

      it('should return null for non-existent bug', () => {
        const result = db.updateBug('999', { title: 'Updated' });
        expect(result).toBeNull();
      });
    });

    describe('deleteBug', () => {
      it('should delete existing bug', () => {
        const bug = db.createBug(sampleBugData);
        
        const deleted = db.deleteBug(bug.id);
        expect(deleted).toBe(true);

        const retrievedBug = db.getBugById(bug.id);
        expect(retrievedBug).toBeNull();
      });

      it('should return false for non-existent bug', () => {
        const deleted = db.deleteBug('999');
        expect(deleted).toBe(false);
      });
    });
  });

  describe('Statistics', () => {
    it('should return correct statistics', () => {
      // Create bugs with different statuses and severities
      const bug1 = db.createBug({ ...sampleBugData, severity: 'high' });
      const bug2 = db.createBug({ ...sampleBugData, severity: 'low' });
      const bug3 = db.createBug({ ...sampleBugData, severity: 'critical' });

      // Update some statuses
      db.updateBug(bug2.id, { status: 'resolved' });
      db.updateBug(bug3.id, { status: 'in-progress' });

      const stats = db.getStats();

      expect(stats.total).toBe(3);
      expect(stats.open).toBe(1);
      expect(stats.inProgress).toBe(1);
      expect(stats.resolved).toBe(1);
      expect(stats.closed).toBe(0);
      expect(stats.severityStats.high).toBe(1);
      expect(stats.severityStats.low).toBe(1);
      expect(stats.severityStats.critical).toBe(1);
      expect(stats.severityStats.medium).toBe(0);
    });
  });

  const sampleBugData = {
    title: 'Test Bug',
    description: 'This is a test bug description',
    severity: 'medium',
    assignee: 'John Doe',
    reporter: 'Jane Smith',
    tags: ['test', 'bug']
  };
});