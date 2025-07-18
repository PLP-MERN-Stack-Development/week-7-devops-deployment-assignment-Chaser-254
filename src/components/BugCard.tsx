import React, { useState } from 'react';
import { Bug } from '../types/Bug';
import { 
  Calendar, 
  User, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle,
  Circle
} from 'lucide-react';

interface Props {
  bug: Bug;
  onUpdate: (id: string, updates: Partial<Bug>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (bug: Bug) => void;
}

export const BugCard: React.FC<Props> = ({ bug, onUpdate, onDelete, onEdit }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getSeverityColor = (severity: Bug['severity']) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity];
  };

  const getStatusColor = (status: Bug['status']) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Bug['status']) => {
    const icons = {
      open: <Circle className="h-4 w-4" />,
      'in-progress': <Clock className="h-4 w-4" />,
      resolved: <CheckCircle className="h-4 w-4" />,
      closed: <XCircle className="h-4 w-4" />
    };
    return icons[status];
  };

  const handleStatusChange = async (newStatus: Bug['status']) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(bug.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating bug status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onDelete(bug.id);
    } catch (error) {
      console.error('Error deleting bug:', error);
    } finally {
      setIsUpdating(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {bug.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {bug.severity}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
              {getStatusIcon(bug.status)}
              <span className="ml-1">{bug.status}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(bug)}
            disabled={isUpdating}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isUpdating}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {bug.description}
      </p>

      {/* Tags */}
      {bug.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {bug.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Assigned to {bug.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Updated {formatDate(bug.updatedAt)}</span>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex gap-1">
          {(['open', 'in-progress', 'resolved', 'closed'] as Bug['status'][]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isUpdating || bug.status === status}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                bug.status === status
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Bug Report
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this bug report? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isUpdating}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};