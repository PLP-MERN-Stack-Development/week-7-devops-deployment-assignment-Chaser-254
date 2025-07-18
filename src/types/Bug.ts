export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee: string;
  reporter: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface BugFormData {
  title: string;
  description: string;
  severity: Bug['severity'];
  assignee: string;
  reporter: string;
  tags: string[];
}

export interface BugFilters {
  status: Bug['status'] | 'all';
  severity: Bug['severity'] | 'all';
  assignee: string;
  search: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}