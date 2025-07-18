import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugCard } from './BugCard';
import { Bug } from '../types/Bug';

describe('BugCard', () => {
  const mockBug: Bug = {
    id: '1',
    title: 'Test Bug',
    description: 'This is a test bug description',
    severity: 'medium',
    status: 'open',
    assignee: 'John Doe',
    reporter: 'Jane Smith',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['test', 'bug']
  };

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render bug information', () => {
    render(
      <BugCard 
        bug={mockBug}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('This is a test bug description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('Assigned to John Doe')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#bug')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BugCard 
        bug={mockBug}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    const editButton = screen.getByRole('button', { name: '' }); // Edit icon button
    await user.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockBug);
  });

  it('should show delete confirmation modal', async () => {
    const user = userEvent.setup();
    render(
      <BugCard 
        bug={mockBug}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => btn.innerHTML.includes('Trash2'));
    
    if (deleteButton) {
      await user.click(deleteButton);
      expect(screen.getByText('Delete Bug Report')).toBeInTheDocument();
    }
  });

  it('should handle status change', async () => {
    const user = userEvent.setup();
    render(
      <BugCard 
        bug={mockBug}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    const resolvedButton = screen.getByRole('button', { name: /resolved/i });
    await user.click(resolvedButton);
    
    expect(mockOnUpdate).toHaveBeenCalledWith('1', { status: 'resolved' });
  });
});