import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugForm } from './BugForm';
import { BugFormData } from '../types/Bug';

describe('BugForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/bug title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/severity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create bug/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/assignee is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/bug title/i), 'Test Bug Title');
    await user.type(screen.getByLabelText(/description/i), 'This is a test bug description');
    await user.selectOptions(screen.getByLabelText(/severity/i), 'high');
    await user.type(screen.getByLabelText(/assignee/i), 'John Doe');
    await user.type(screen.getByLabelText(/reporter/i), 'Jane Smith');
    
    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug Title',
        description: 'This is a test bug description',
        severity: 'high',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        tags: []
      });
    });
  });

  it('should handle tag addition and removal', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const tagInput = screen.getByPlaceholderText(/add a tag/i);
    const addButton = screen.getByRole('button', { name: '' }); // Plus icon button
    
    await user.type(tagInput, 'test-tag');
    await user.click(addButton);
    
    expect(screen.getByText('test-tag')).toBeInTheDocument();
    
    // Remove tag
    const removeButton = screen.getByRole('button', { name: '' }); // X icon button
    await user.click(removeButton);
    
    expect(screen.queryByText('test-tag')).not.toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });
});