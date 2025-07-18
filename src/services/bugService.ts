import { Bug, BugFormData, ApiResponse } from '../types/Bug';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

export class BugService {
  async getAllBugs(): Promise<ApiResponse<Bug[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs`);
      const data = await handleResponse(response);
      
      // Convert date strings back to Date objects
      const bugs = data.data.map((bug: any) => ({
        ...bug,
        createdAt: new Date(bug.createdAt),
        updatedAt: new Date(bug.updatedAt)
      }));
      
      return {
        success: true,
        data: bugs
      };
    } catch (error) {
      console.error('Error fetching bugs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bugs'
      };
    }
  }

  async getBugById(id: string): Promise<ApiResponse<Bug>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs/${id}`);
      const data = await handleResponse(response);
      
      // Convert date strings back to Date objects
      const bug = {
        ...data.data,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt)
      };
      
      return {
        success: true,
        data: bug
      };
    } catch (error) {
      console.error('Error fetching bug:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bug'
      };
    }
  }

  async createBug(formData: BugFormData): Promise<ApiResponse<Bug>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await handleResponse(response);
      
      // Convert date strings back to Date objects
      const bug = {
        ...data.data,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt)
      };

      return {
        success: true,
        data: bug,
        message: data.message
      };
    } catch (error) {
      console.error('Error creating bug:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create bug'
      };
    }
  }

  async updateBug(id: string, updates: Partial<Bug>): Promise<ApiResponse<Bug>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      const data = await handleResponse(response);
      
      // Convert date strings back to Date objects
      const bug = {
        ...data.data,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt)
      };

      return {
        success: true,
        data: bug,
        message: data.message
      };
    } catch (error) {
      console.error('Error updating bug:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update bug'
      };
    }
  }

  async deleteBug(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs/${id}`, {
        method: 'DELETE'
      });
      
      const data = await handleResponse(response);

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Error deleting bug:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete bug'
      };
    }
  }

  // Method with intentional bug for debugging demonstration
  async getBugsByStatus(status: Bug['status']): Promise<ApiResponse<Bug[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs?status=${status}`);
      const data = await handleResponse(response);
      
      // Convert date strings back to Date objects
      const bugs = data.data.map((bug: any) => ({
        ...bug,
        createdAt: new Date(bug.createdAt),
        updatedAt: new Date(bug.updatedAt)
      }));
      
      return {
        success: true,
        data: bugs
      };
    } catch (error) {
      console.error('Error filtering bugs by status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to filter bugs'
      };
    }
  }

  async getStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs/stats`);
      const data = await handleResponse(response);
      
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats'
      };
    }
  }
}

export const bugService = new BugService();