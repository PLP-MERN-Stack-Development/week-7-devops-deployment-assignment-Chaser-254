import React, { useState, useEffect } from 'react';
import { Bug, BugFormData } from './types/Bug';
import { bugService } from './services/bugService';
import { BugForm } from './components/BugForm';
import { BugList } from './components/BugList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { addSampleBugs } from './utils/storage';
import { 
  Bug as BugIcon, 
  Plus, 
  Settings, 
  Database,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

type View = 'list' | 'create' | 'edit';

function App() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('list');
  const [editingBug, setEditingBug] = useState<Bug | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bugService.getAllBugs();
      
      if (response.success && response.data) {
        setBugs(response.data);
      } else {
        setError(response.error || 'Failed to load bugs');
      }
    } catch (err) {
      console.error('Error loading bugs:', err);
      setError('Failed to load bugs');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateBug = async (formData: BugFormData) => {
    try {
      setSubmitting(true);
      
      const response = await bugService.createBug(formData);
      
      if (response.success && response.data) {
        setBugs(prev => [response.data!, ...prev]);
        setView('list');
        showNotification('success', 'Bug created successfully!');
      } else {
        showNotification('error', response.error || 'Failed to create bug');
      }
    } catch (err) {
      console.error('Error creating bug:', err);
      showNotification('error', 'Failed to create bug');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBug = async (id: string, updates: Partial<Bug>) => {
    try {
      const response = await bugService.updateBug(id, updates);
      
      if (response.success && response.data) {
        setBugs(prev => prev.map(bug => 
          bug.id === id ? response.data! : bug
        ));
        
        if (view === 'edit') {
          setView('list');
          setEditingBug(null);
        }
        
        showNotification('success', 'Bug updated successfully!');
      } else {
        showNotification('error', response.error || 'Failed to update bug');
      }
    } catch (err) {
      console.error('Error updating bug:', err);
      showNotification('error', 'Failed to update bug');
    }
  };

  const handleDeleteBug = async (id: string) => {
    try {
      const response = await bugService.deleteBug(id);
      
      if (response.success) {
        setBugs(prev => prev.filter(bug => bug.id !== id));
        showNotification('success', 'Bug deleted successfully!');
      } else {
        showNotification('error', response.error || 'Failed to delete bug');
      }
    } catch (err) {
      console.error('Error deleting bug:', err);
      showNotification('error', 'Failed to delete bug');
    }
  };

  const handleEditBug = (bug: Bug) => {
    setEditingBug(bug);
    setView('edit');
  };

  const handleEditSubmit = async (formData: BugFormData) => {
    if (!editingBug) return;
    
    await handleUpdateBug(editingBug.id, formData);
  };

  const handleAddSampleData = () => {
    addSampleBugs();
    loadBugs();
    showNotification('success', 'Sample bugs added!');
  };

  // Debug function to simulate error
  const simulateError = () => {
    throw new Error('This is a simulated error for debugging purposes');
  };

  const getStatusStats = () => {
    const stats = {
      open: bugs.filter(bug => bug.status === 'open').length,
      'in-progress': bugs.filter(bug => bug.status === 'in-progress').length,
      resolved: bugs.filter(bug => bug.status === 'resolved').length,
      closed: bugs.filter(bug => bug.status === 'closed').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading bug tracker...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bugs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadBugs}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <BugIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Bug Tracker
                  </h1>
                  <p className="text-sm text-gray-600">
                    Track and manage project issues
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{stats.open} Open</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>{stats['in-progress']} In Progress</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{stats.resolved} Resolved</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddSampleData}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Add Sample Data"
                  >
                    <Database className="h-5 w-5" />
                  </button>
                  
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={simulateError}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Simulate Error (Debug)"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setView('create')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    New Bug
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === 'list' && (
            <BugList
              bugs={bugs}
              loading={loading}
              onUpdateBug={handleUpdateBug}
              onDeleteBug={handleDeleteBug}
              onEditBug={handleEditBug}
            />
          )}

          {view === 'create' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Create New Bug Report
                </h2>
                <BugForm
                  onSubmit={handleCreateBug}
                  onCancel={() => setView('list')}
                  loading={submitting}
                />
              </div>
            </div>
          )}

          {view === 'edit' && editingBug && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Edit Bug Report
                </h2>
                <BugForm
                  onSubmit={handleEditSubmit}
                  onCancel={() => {
                    setView('list');
                    setEditingBug(null);
                  }}
                  initialData={editingBug}
                  loading={submitting}
                />
              </div>
            </div>
          )}
        </main>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;