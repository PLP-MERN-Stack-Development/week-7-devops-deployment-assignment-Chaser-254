import React, { useState, useEffect } from 'react';
import { Bug, BugFormData, ValidationErrors } from '../types/Bug';
import { validateBugForm, sanitizeInput, validateTags } from '../utils/validation';
import { X, Plus, AlertCircle } from 'lucide-react';

interface Props {
  onSubmit: (formData: BugFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Bug;
  loading?: boolean;
}

export const BugForm: React.FC<Props> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<BugFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    severity: initialData?.severity || 'medium',
    assignee: initialData?.assignee || '',
    reporter: initialData?.reporter || '',
    tags: initialData?.tags || []
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof BugFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      const updatedTags = [...formData.tags, newTag.trim()];
      setFormData(prev => ({
        ...prev,
        tags: validateTags(updatedTags)
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateBugForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Bug Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter a descriptive title for the bug"
            disabled={loading}
          />
          {errors.title && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.title}
            </div>
          )}
        </div>

        {/* Severity */}
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
            Severity *
          </label>
          <select
            id="severity"
            value={formData.severity}
            onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as Bug['severity'] }))}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.severity ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          {errors.severity && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.severity}
            </div>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
            Assignee *
          </label>
          <input
            type="text"
            id="assignee"
            value={formData.assignee}
            onChange={(e) => handleInputChange('assignee', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.assignee ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Assigned developer name"
            disabled={loading}
          />
          {errors.assignee && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.assignee}
            </div>
          )}
        </div>

        {/* Reporter */}
        <div>
          <label htmlFor="reporter" className="block text-sm font-medium text-gray-700 mb-2">
            Reporter *
          </label>
          <input
            type="text"
            id="reporter"
            value={formData.reporter}
            onChange={(e) => handleInputChange('reporter', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reporter ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Person who reported the bug"
            disabled={loading}
          />
          {errors.reporter && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.reporter}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!newTag.trim() || loading}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe the bug, steps to reproduce, and expected behavior"
          disabled={loading}
        />
        {errors.description && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : (initialData ? 'Update Bug' : 'Create Bug')}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};