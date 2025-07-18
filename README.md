# Bug Tracker Application

A comprehensive bug tracking application built with the MERN stack (MongoDB alternative with file-based storage), Express.js, React, and Node.js. This project demonstrates modern full-stack web development practices including extensive testing, debugging techniques, and error handling.

## Features

- **Complete Bug Management**: Create, update, delete, and track bugs with status management
- **Advanced Filtering**: Search and filter bugs by status, severity, assignee, and keywords
- **Form Validation**: Comprehensive client-side validation with real-time feedback
- **Error Handling**: Robust error boundaries and graceful error handling
- **Testing Suite**: Extensive unit and integration tests
- **Debugging Tools**: Built-in debugging utilities and error simulation
- **Responsive Design**: Mobile-first design that works on all devices
- **Local Storage**: Persistent data storage with localStorage

## Tech Stack

- **Backend**: Node.js, Express.js, File-based JSON storage
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Testing**: Vitest, React Testing Library, Jest DOM
- **Backend Testing**: Supertest for API testing
- **Icons**: Lucide React
- **Security**: Helmet, CORS, Rate limiting, Input validation
- **Authentication**: JWT tokens, bcrypt password hashing
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: File-based JSON database with Express API

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-bug-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   # Start both backend and frontend
   npm run dev:full
   
   # Or start them separately:
   # Backend only (port 3001)
   npm run dev:server
   
   # Frontend only (port 5173)
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001/api`
   - Health check: `http://localhost:3001/api/health`

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev:server` - Start backend server only
- `npm run dev:full` - Start both backend and frontend
- `npm start` - Start production server

### Testing Scripts
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:server` - Run backend tests only
- `npm run test:server:watch` - Run backend tests in watch mode

### Other Scripts
- `npm run lint` - Run ESLint

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run backend tests
npm run test:server

# Run backend tests in watch mode
npm run test:server:watch
```

### Test Coverage

The application includes comprehensive tests covering:

- **Unit Tests**: Individual components and utility functions
- **Integration Tests**: Component interactions and API calls
- **Form Validation**: Input validation and error handling
- **Error Boundaries**: Error catching and recovery
- **API Testing**: Backend route testing with Supertest
- **Database Operations**: CRUD operations and data validation
- **Authentication**: JWT token handling and user management

### Test Structure

```
src/
├── components/
│   ├── BugCard.test.tsx
│   ├── BugForm.test.tsx
│   └── ErrorBoundary.test.tsx
├── services/
│   └── bugService.test.ts
├── utils/
│   └── validation.test.ts
├── test/
│   └── setup.ts
└── server/
    └── tests/
        ├── bugRoutes.test.js
        ├── database.test.js
        └── errorHandler.test.js
```

## API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

### Endpoints

#### Bugs
- `GET /bugs` - Get all bugs (with optional filtering)
- `GET /bugs/:id` - Get specific bug
- `POST /bugs` - Create new bug
- `PUT /bugs/:id` - Update bug
- `DELETE /bugs/:id` - Delete bug
- `GET /bugs/stats` - Get bug statistics

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

#### Health
- `GET /health` - Health check endpoint

### Query Parameters (GET /bugs)
- `status` - Filter by status (open, in-progress, resolved, closed)
- `severity` - Filter by severity (low, medium, high, critical)
- `assignee` - Filter by assignee name
- `search` - Search in title, description, and tags
- `page` - Page number for pagination
- `limit` - Items per page (max 100)

## Debugging Techniques

### 1. Console Debugging
The application includes strategic console.log statements for debugging both frontend and backend:
- API requests and responses
- Backend route handling
- Database operations
- Form submissions
- Data loading states
- Error conditions

### 2. Chrome DevTools
- **Network Tab**: Monitor real API calls to backend
- **Console Tab**: View debug logs and errors
- **React DevTools**: Inspect component state and props
- **Application Tab**: Check localStorage and session data

### 3. Node.js Debugging
- **Node Inspector**: Debug backend code with `node --inspect`
- **Console Logging**: Strategic server-side logging
- **Error Stack Traces**: Detailed error information in development
- **Request/Response Logging**: Morgan middleware for HTTP logging

### 4. Error Simulation
The application includes debugging tools for testing error conditions:
- Frontend error boundary testing
- Backend error simulation endpoints
- Network failure simulation
- Validation error testing

### 5. Built-in Debugging Tools
- Sample data generator for testing
- Detailed error messages in development mode
- Real API integration with error handling
- Form validation feedback
- Health check endpoints
- Database inspection utilities

## Error Handling

### Error Boundaries
The application uses comprehensive error handling on both frontend and backend:

#### Frontend Error Boundaries
- Global error boundary wrapping the entire application
- Component-specific error handling
- Fallback UI for error states
- Error logging for debugging

#### Backend Error Handling
- Express error handling middleware
- Custom AppError class for operational errors
- Validation error handling with express-validator
- Rate limiting and security middleware
- Graceful server shutdown handling

### Validation
Comprehensive validation on both client and server:

#### Frontend Validation
- Real-time form validation
- Input sanitization
- Client-side error feedback

#### Backend Validation
- Express-validator middleware
- Request body validation
- Parameter validation
- Data sanitization and normalization

### API Error Handling
- Proper HTTP status codes
- Consistent error response format
- Network error recovery
- Timeout handling
- User-friendly error messages

## Project Structure

```
project-root/
├── server/                 # Backend Express application
│   ├── app.js             # Express app configuration
│   ├── server.js          # Server startup
│   ├── database/          # Database operations
│   │   ├── database.js    # Database abstraction layer
│   │   └── data.json      # JSON file storage
│   ├── routes/            # API routes
│   │   ├── bugRoutes.js   # Bug CRUD operations
│   │   └── authRoutes.js  # Authentication routes
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.js # Error handling
│   │   ├── asyncHandler.js # Async error wrapper
│   │   └── auth.js        # Authentication middleware
│   └── tests/             # Backend tests
│       ├── bugRoutes.test.js
│       ├── database.test.js
│       └── errorHandler.test.js
src/
├── components/          # React components
│   ├── BugCard.tsx     # Individual bug display
│   ├── BugForm.tsx     # Bug creation/editing form
│   ├── BugList.tsx     # Bug listing with filters
│   ├── BugFilters.tsx  # Filtering components
│   ├── ErrorBoundary.tsx # Error boundary component
│   └── LoadingSpinner.tsx # Loading indicator
├── services/           # API service layer
│   └── bugService.ts   # Frontend API client
├── types/             # TypeScript definitions
│   └── Bug.ts         # Bug-related types
├── utils/             # Utility functions
│   ├── validation.ts  # Form validation logic
│   └── storage.ts     # Local storage utilities
└── test/              # Frontend test configuration
    └── setup.ts       # Test setup and mocks
```

## Key Features

### Backend API
- RESTful API design with proper HTTP methods
- Request validation and sanitization
- Error handling with appropriate status codes
- Rate limiting and security headers
- File-based JSON database with CRUD operations
- Authentication with JWT tokens
- Comprehensive API testing with Supertest

### Bug Management
- Create new bug reports with detailed information
- Update bug status (open, in-progress, resolved, closed)
- Edit existing bug reports
- Delete bug reports with confirmation
- Tag system for categorization
- Real-time data synchronization with backend

### Filtering and Search
- Filter by status, severity, and assignee
- Full-text search across title, description, and tags
- Sorting by date, severity, and status
- Clear all filters functionality
- Server-side filtering and pagination

### Form Validation
- Real-time validation feedback
- Required field validation
- Length constraints
- Input sanitization (client and server)
- Tag management with validation
- Server-side validation with express-validator

### Data Management
- File-based JSON database
- Automatic data persistence
- Database backup and recovery
- Sample data generation
- Statistics and analytics

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization
- SQL injection prevention (not applicable but good practice)
### User Experience
- Responsive design for all devices
- Loading states and progress indicators
- Success and error notifications
- Keyboard navigation support
- Accessibility features
- Real-time error handling
- Optimistic UI updates

## Testing Strategy

### Unit Tests
#### Frontend
- React component rendering and behavior
- Utility function logic
- Form validation rules
- Error boundary functionality

#### Backend
- Database operations (CRUD)
- Validation functions
- Error handling middleware
- Authentication logic

### Integration Tests
#### Frontend
- Component interactions and data flow
- Form submission workflows
- API integration with real backend
- User interaction scenarios

#### Backend
- API route testing with Supertest
- Request/response validation
- Database integration
- Error handling workflows

### API Testing
- HTTP method testing (GET, POST, PUT, DELETE)
- Request validation testing
- Error response testing
- Authentication flow testing
- Rate limiting testing

## Debugging Best Practices

1. **Use Console Debugging**: Strategic console.log statements for tracking data flow
2. **Node.js Inspector**: Use Node.js debugging tools for server-side debugging
3. **Error Boundaries**: Implement error boundaries to catch and handle errors gracefully
4. **API Testing**: Use tools like Postman or curl to test API endpoints
5. **Validation Feedback**: Provide immediate feedback for form validation
6. **Network Monitoring**: Use browser DevTools to monitor real API calls
7. **React DevTools**: Use React DevTools to inspect component state
8. **Database Inspection**: Monitor database operations and data integrity
9. **Error Simulation**: Test error conditions with simulated errors
10. **Logging**: Implement comprehensive logging on both client and server

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```
## Future Enhancements

- MongoDB integration for production database
- User authentication and authorization
- File attachment support
- Advanced reporting and analytics
- Email notifications
- Real-time collaboration features
- Export to PDF/CSV
- Advanced search with filters
- Bulk operations
- Integration with external tools (GitHub, Jira)
- Docker containerization
- CI/CD pipeline setup
- Production deployment guides

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality (both frontend and backend)
5. Run the full test suite (`npm run test` and `npm run test:server`)
6. Ensure all tests pass
7. Submit a pull request

## Production Deployment

### Automated Deployment with GitHub Actions

This project includes automated deployment workflows for:
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Railway

#### Setup Instructions

1. **Fork/Clone the repository to GitHub**

2. **Setup Vercel**
   - Connect your GitHub repository to Vercel
   - Get your Vercel tokens from the dashboard
   - Add these secrets to your GitHub repository:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID` 
     - `VERCEL_PROJECT_ID`

3. **Setup Railway**
   - Connect your GitHub repository to Railway
   - Create a new service for the backend
   - Get your Railway token from the dashboard
   - Add these secrets to your GitHub repository:
     - `RAILWAY_TOKEN`
     - `RAILWAY_SERVICE_NAME`
     - `RAILWAY_BACKEND_URL` (your Railway app URL)

4. **Configure Environment Variables**
   - In Railway: Set `NODE_ENV=production`, `JWT_SECRET`, `FRONTEND_URL`
   - In Vercel: Set `VITE_API_URL` to your Railway backend URL

5. **Deploy**
   - Push to `main` or `master` branch
   - GitHub Actions will automatically deploy both frontend and backend
   - Tests run before deployment to ensure code quality

#### Manual Deployment

**Frontend to Vercel:**
```bash
npm run build
vercel --prod
```

**Backend to Railway:**
```bash
railway login
railway deploy
```

### Environment Variables

#### Development (.env)
```env
VITE_API_URL=http://localhost:3001/api
NODE_ENV=development
JWT_SECRET=your-development-secret
PORT=3001
```

#### Production
**Railway (Backend):**
- `NODE_ENV=production`
- `JWT_SECRET=your-production-secret`
- `FRONTEND_URL=https://your-app.vercel.app`
- `PORT=3001`

**Vercel (Frontend):**
- `VITE_API_URL=https://your-railway-app.railway.app/api`

### Deployment Features

- **Automated Testing**: Tests run before deployment
- **Health Checks**: Railway monitors backend health
- **Environment Management**: Separate configs for dev/prod
- **CORS Configuration**: Properly configured for cross-origin requests
- **Error Handling**: Production-ready error responses
- **Security**: Rate limiting and security headers enabled

## License

This project is licensed under the MIT License.