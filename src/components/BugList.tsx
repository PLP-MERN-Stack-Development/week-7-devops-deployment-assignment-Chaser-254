import React, { useState } from 'react';
import { Bug, BugFilters } from '../types/Bug';
import { BugCard } from './BugCard';
import { BugFiltersComponent } from './BugFilters';
import { Search, Filter, SortDesc } from 'lucide-react';

interface Props {
  bugs: Bug[];
  loading: boolean;
  onUpdateBug: (id: string, updates: Partial<Bug>) => Promise<void>;
  onDeleteBug: (id: string) => Promise<void>;
  onEditBug: (bug: Bug) => void;
}

export const BugList: React.FC<Props> = ({
  bugs,
  loading,
  onUpdateBug,
  onDeleteBug,
  onEditBug
}) => {
  const [filters, setFilters] = useState<BugFilters>({
    status: 'all',
    severity: 'all',
    assignee: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'status'>('date');

  const filterBugs = (bugs: Bug[]): Bug[] => {
    let filtered = bugs;

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(bug => bug.status === filters.status);
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(bug => bug.severity === filters.severity);
    }

    // Assignee filter
    if (filters.assignee) {
      filtered = filtered.filter(bug => 
        bug.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
      );
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(bug =>
        bug.title.toLowerCase().includes(searchTerm) ||
        bug.description.toLowerCase().includes(searchTerm) ||
        bug.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  };

  const sortBugs = (bugs: Bug[]): Bug[] => {
    const sorted = [...bugs];
    
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
      case 'status':
        const statusOrder = { open: 4, 'in-progress': 3, resolved: 2, closed: 1 };
        return sorted.sort((a, b) => statusOrder[b.status] - statusOrder[a.status]);
      default:
        return sorted;
    }
  };

  const filteredAndSortedBugs = sortBugs(filterBugs(bugs));

  const handleFiltersChange = (newFilters: BugFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters); // Debug log
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Bug Reports ({filteredAndSortedBugs.length})
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-md transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <SortDesc className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'severity' | 'status')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="severity">Sort by Severity</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <BugFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      {/* Bug List */}
      {filteredAndSortedBugs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">
            {bugs.length === 0 ? 'No bugs reported yet' : 'No bugs match your filters'}
          </div>
          <p className="text-sm text-gray-400">
            {bugs.length === 0 
              ? 'Create your first bug report to get started'
              : 'Try adjusting your filters to see more results'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedBugs.map((bug) => (
            <BugCard
              key={bug.id}
              bug={bug}
              onUpdate={onUpdateBug}
              onDelete={onDeleteBug}
              onEdit={onEditBug}
            />
          ))}
        </div>
      )}
    </div>
  );
};