import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BugService } from './bugService';
import { BugFormData } from '../types/Bug';

// Mock the storage module
vi.mock('../utils/storage', () => ({
  loadBugsFromStorage: vi.fn(() => []),
  saveBugsToStorage: vi.fn(),
  clearBugsFromStorage: vi.fn()
}));

describe('BugService', () => {
  let bugService: BugService;

  beforeEach(() => {
    bugService = new BugService();
  });

  describe('getAllBugs', () => {
    it('should return all bugs successfully', async () => {
      const response = await bugService.getAllBugs();
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('createBug', () => {
    const validFormData: BugFormData = {
      title: 'Test Bug Title',
      description: 'This is a test bug description',
      severity: 'medium',
      assignee: 'John Doe',
      reporter: 'Jane Smith',
      tags: ['test']
    };

    it('should create a bug successfully', async () => {
      const response = await bugService.createBug(validFormData);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.title).toBe(validFormData.title);
      expect(response.data?.id).toBeDefined();
      expect(response.data?.status).toBe('open');
    });

    it('should return validation error for invalid data', async () => {
      const invalidFormData = { ...validFormData, title: '' };
      const response = await bugService.createBug(invalidFormData);
      
      expect(response.success).toBe(false);
      expect(response.error).toBe('Validation failed');
    });
  });

  describe('updateBug', () => {
    it('should return error for non-existent bug', async () => {
      const response = await bugService.updateBug('non-existent-id', { title: 'Updated' });
      
      expect(response.success).toBe(false);
      expect(response.error).toContain('not found');
    });
  });

  describe('deleteBug', () => {
    it('should return error for non-existent bug', async () => {
      const response = await bugService.deleteBug('non-existent-id');
      
      expect(response.success).toBe(false);
      expect(response.error).toContain('not found');
    });
  });
});