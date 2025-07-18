import { BugFormData } from '../types/Bug';

export interface ValidationErrors {
  title?: string;
  description?: string;
  severity?: string;
  assignee?: string;
  reporter?: string;
  tags?: string;
}

export const validateBugForm = (formData: BugFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Description validation
  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (formData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // Severity validation
  if (!formData.severity) {
    errors.severity = 'Severity is required';
  }

  // Assignee validation
  if (!formData.assignee.trim()) {
    errors.assignee = 'Assignee is required';
  } else if (formData.assignee.length < 2) {
    errors.assignee = 'Assignee name must be at least 2 characters long';
  }

  // Reporter validation
  if (!formData.reporter.trim()) {
    errors.reporter = 'Reporter is required';
  } else if (formData.reporter.length < 2) {
    errors.reporter = 'Reporter name must be at least 2 characters long';
  }

  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateTags = (tags: string[]): string[] => {
  return tags
    .filter(tag => tag.trim().length > 0)
    .map(tag => sanitizeInput(tag))
    .slice(0, 5); // Limit to 5 tags
};