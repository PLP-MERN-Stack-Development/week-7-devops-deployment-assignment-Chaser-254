import { Bug } from '../types/Bug';

const STORAGE_KEY = 'bug-tracker-bugs';

export const loadBugsFromStorage = (): Bug[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const bugs = JSON.parse(stored);
    return bugs.map((bug: any) => ({
      ...bug,
      createdAt: new Date(bug.createdAt),
      updatedAt: new Date(bug.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading bugs from storage:', error);
    return [];
  }
};

export const saveBugsToStorage = (bugs: Bug[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
  } catch (error) {
    console.error('Error saving bugs to storage:', error);
    throw new Error('Failed to save bugs to storage');
  }
};

export const clearBugsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing bugs from storage:', error);
  }
};

// Debug utility to add sample data
export const addSampleBugs = (): void => {
  const sampleBugs: Bug[] = [
    {
      id: '1',
      title: 'Login form validation error',
      description: 'Users are unable to login when password contains special characters',
      severity: 'high',
      status: 'open',
      assignee: 'John Doe',
      reporter: 'Jane Smith',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ['authentication', 'validation']
    },
    {
      id: '2',
      title: 'Dashboard loading performance issue',
      description: 'Dashboard takes more than 5 seconds to load with large datasets',
      severity: 'medium',
      status: 'in-progress',
      assignee: 'Mike Johnson',
      reporter: 'Sarah Wilson',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      tags: ['performance', 'dashboard']
    }
  ];
  
  saveBugsToStorage(sampleBugs);
};