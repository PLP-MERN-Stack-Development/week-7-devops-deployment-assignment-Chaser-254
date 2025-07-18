const fs = require('fs');
const path = require('path');

// In-memory database simulation
let database = {
  bugs: [],
  users: [],
  nextBugId: 1,
  nextUserId: 1
};

const DB_FILE = path.join(__dirname, 'data.json');

// Initialize database
const initializeDatabase = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      database = JSON.parse(data);
      console.log('📁 Database loaded from file');
    } else {
      // Create sample data
      database.bugs = [
        {
          id: '1',
          title: 'Login form validation error',
          description: 'Users are unable to login when password contains special characters',
          severity: 'high',
          status: 'open',
          assignee: 'John Doe',
          reporter: 'Jane Smith',
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString(),
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
          createdAt: new Date('2024-01-14').toISOString(),
          updatedAt: new Date('2024-01-16').toISOString(),
          tags: ['performance', 'dashboard']
        }
      ];
      database.nextBugId = 3;
      saveDatabase();
      console.log('📁 Database initialized with sample data');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    database = { bugs: [], users: [], nextBugId: 1, nextUserId: 1 };
  }
};

// Save database to file
const saveDatabase = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('❌ Error saving database:', error);
  }
};

// Database operations
const db = {
  // Bug operations
  getAllBugs: () => {
    return database.bugs.map(bug => ({
      ...bug,
      createdAt: new Date(bug.createdAt),
      updatedAt: new Date(bug.updatedAt)
    }));
  },

  getBugById: (id) => {
    const bug = database.bugs.find(b => b.id === id);
    if (!bug) return null;
    
    return {
      ...bug,
      createdAt: new Date(bug.createdAt),
      updatedAt: new Date(bug.updatedAt)
    };
  },

  createBug: (bugData) => {
    const newBug = {
      id: database.nextBugId.toString(),
      ...bugData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    database.bugs.push(newBug);
    database.nextBugId++;
    saveDatabase();
    
    return {
      ...newBug,
      createdAt: new Date(newBug.createdAt),
      updatedAt: new Date(newBug.updatedAt)
    };
  },

  updateBug: (id, updates) => {
    const bugIndex = database.bugs.findIndex(b => b.id === id);
    if (bugIndex === -1) return null;
    
    database.bugs[bugIndex] = {
      ...database.bugs[bugIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    saveDatabase();
    
    const updatedBug = database.bugs[bugIndex];
    return {
      ...updatedBug,
      createdAt: new Date(updatedBug.createdAt),
      updatedAt: new Date(updatedBug.updatedAt)
    };
  },

  deleteBug: (id) => {
    const bugIndex = database.bugs.findIndex(b => b.id === id);
    if (bugIndex === -1) return false;
    
    database.bugs.splice(bugIndex, 1);
    saveDatabase();
    return true;
  },

  // User operations (for future authentication)
  createUser: (userData) => {
    const newUser = {
      id: database.nextUserId.toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    database.users.push(newUser);
    database.nextUserId++;
    saveDatabase();
    
    return newUser;
  },

  getUserByEmail: (email) => {
    return database.users.find(u => u.email === email);
  },

  // Utility functions
  clearAllBugs: () => {
    database.bugs = [];
    database.nextBugId = 1;
    saveDatabase();
  },

  getStats: () => {
    const bugs = database.bugs;
    return {
      total: bugs.length,
      open: bugs.filter(b => b.status === 'open').length,
      inProgress: bugs.filter(b => b.status === 'in-progress').length,
      resolved: bugs.filter(b => b.status === 'resolved').length,
      closed: bugs.filter(b => b.status === 'closed').length,
      severityStats: {
        low: bugs.filter(b => b.severity === 'low').length,
        medium: bugs.filter(b => b.severity === 'medium').length,
        high: bugs.filter(b => b.severity === 'high').length,
        critical: bugs.filter(b => b.severity === 'critical').length
      }
    };
  }
};

module.exports = {
  initializeDatabase,
  saveDatabase,
  db
};