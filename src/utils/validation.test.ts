import { describe, it, expect } from 'vitest';
import { validateBugForm, isValidEmail, sanitizeInput, validateTags } from './validation';
import { BugFormData } from '../types/Bug';

describe('Validation Utils', () => {
  describe('validateBugForm', () => {
    const validFormData: BugFormData = {
      title: 'Test Bug Title',
      description: 'This is a test bug description',
      severity: 'medium',
      assignee: 'John Doe',
      reporter: 'Jane Smith',
      tags: ['test', 'bug']
    };

    it('should return no errors for valid form data', () => {
      const errors = validateBugForm(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return error for empty title', () => {
      const formData = { ...validFormData, title: '' };
      const errors = validateBugForm(formData);
      expect(errors.title).toBe('Title is required');
    });

    it('should return error for title too short', () => {
      const formData = { ...validFormData, title: 'Test' };
      const errors = validateBugForm(formData);
      expect(errors.title).toBe('Title must be at least 5 characters long');
    });

    it('should return error for title too long', () => {
      const formData = { ...validFormData, title: 'a'.repeat(101) };
      const errors = validateBugForm(formData);
      expect(errors.title).toBe('Title must be less than 100 characters');
    });

    it('should return error for empty description', () => {
      const formData = { ...validFormData, description: '' };
      const errors = validateBugForm(formData);
      expect(errors.description).toBe('Description is required');
    });

    it('should return error for description too short', () => {
      const formData = { ...validFormData, description: 'Short' };
      const errors = validateBugForm(formData);
      expect(errors.description).toBe('Description must be at least 10 characters long');
    });

    it('should return error for empty assignee', () => {
      const formData = { ...validFormData, assignee: '' };
      const errors = validateBugForm(formData);
      expect(errors.assignee).toBe('Assignee is required');
    });

    it('should return error for empty reporter', () => {
      const formData = { ...validFormData, reporter: '' };
      const errors = validateBugForm(formData);
      expect(errors.reporter).toBe('Reporter is required');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('  Hello World  ')).toBe('Hello World');
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('validateTags', () => {
    it('should filter empty tags', () => {
      const result = validateTags(['tag1', '', 'tag2', '   ']);
      expect(result).toEqual(['tag1', 'tag2']);
    });

    it('should limit to 5 tags', () => {
      const result = validateTags(['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']);
      expect(result).toHaveLength(5);
    });

    it('should sanitize tags', () => {
      const result = validateTags(['<tag>']);
      expect(result).toEqual(['tag']);
    });
  });
});