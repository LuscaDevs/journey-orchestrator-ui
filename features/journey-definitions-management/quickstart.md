# Journey Definitions Management - Quick Start Guide

## Overview

This guide helps developers quickly set up and work with the Journey Definitions Management feature. It provides step-by-step instructions for development, testing, and deployment.

## Prerequisites

### Required Tools
- Node.js 18+ 
- npm or yarn
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Development Environment
- VS Code (recommended)
- React Developer Tools extension
- TypeScript knowledge
- React knowledge

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd journey-orchestrator-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Install Additional Dependencies

```bash
# Install required packages for this feature
npm install react-router-dom react-hot-toast
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_JOURNEY_DEFINITIONS=true
```

## Development Workflow

### 1. Project Structure

```
src/
├── pages/
│   ├── JourneyDefinitionsPage.tsx
│   └── JourneyDetailsPage.tsx
├── components/
│   ├── JourneyDefinitionList.tsx
│   ├── JourneyDefinitionCard.tsx
│   └── CreateJourneyModal.tsx
├── services/
│   └── journeyService.ts (extend existing)
├── hooks/
│   ├── useJourneyDefinitions.ts
│   └── useCreateJourney.ts
├── types/
│   └── journey.types.ts
└── utils/
    ├── validation.ts
    └── constants.ts
```

### 2. Create Basic Components

#### Journey Definitions Page

```typescript
// src/pages/JourneyDefinitionsPage.tsx
import { useState, useEffect } from 'react';
import { JourneyDefinitionList } from '../components/JourneyDefinitionList';
import { CreateJourneyModal } from '../components/CreateJourneyModal';
import { useJourneyDefinitions } from '../hooks/useJourneyDefinitions';
import toast from 'react-hot-toast';

export function JourneyDefinitionsPage() {
  const { journeys, loading, error, loadJourneys, createJourney } = useJourneyDefinitions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadJourneys();
  }, []);

  const handleCreateJourney = async (data: CreateJourneyFormData) => {
    try {
      await createJourney(data);
      setIsCreateModalOpen(false);
      toast.success('Journey created successfully!');
    } catch (error) {
      toast.error('Failed to create journey');
    }
  };

  return (
    <div className="journey-definitions-page">
      <JourneyDefinitionList
        journeys={journeys}
        loading={loading}
        error={error}
        onCreateJourney={() => setIsCreateModalOpen(true)}
      />
      
      <CreateJourneyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateJourney}
      />
    </div>
  );
}
```

#### Journey Definition List

```typescript
// src/components/JourneyDefinitionList.tsx
import { JourneyDefinitionCard } from './JourneyDefinitionCard';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface JourneyDefinitionListProps {
  journeys: JourneyDefinitionListItem[];
  loading: boolean;
  error?: string;
  onCreateJourney: () => void;
}

export function JourneyDefinitionList({
  journeys,
  loading,
  error,
  onCreateJourney
}: JourneyDefinitionListProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load journey definitions</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (journeys.length === 0) {
    return <EmptyState onCreateJourney={onCreateJourney} />;
  }

  return (
    <div className="journey-list">
      {journeys.map((journey) => (
        <JourneyDefinitionCard
          key={journey.id}
          journey={journey}
          onClick={() => {/* Navigate to journey details */}}
        />
      ))}
    </div>
  );
}
```

### 3. Create Custom Hooks

#### Use Journey Definitions Hook

```typescript
// src/hooks/useJourneyDefinitions.ts
import { useState, useEffect } from 'react';
import { journeyService } from '../services/journeyService';
import { JourneyDefinitionListItem } from '../types/journey.types';

export function useJourneyDefinitions() {
  const [journeys, setJourneys] = useState<JourneyDefinitionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const loadJourneys = async () => {
    setLoading(true);
    setError(undefined);
    
    try {
      const response = await journeyService.listJourneyDefinitions();
      setJourneys(response);
    } catch (err) {
      setError('Failed to load journey definitions');
      console.error('Load journeys error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createJourney = async (data: CreateJourneyFormData) => {
    setLoading(true);
    
    try {
      const newJourney = await journeyService.createJourneyDefinition(data);
      setJourneys(prev => [...prev, newJourney]);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    journeys,
    loading,
    error,
    loadJourneys,
    createJourney
  };
}
```

### 4. Extend Service Layer

```typescript
// src/services/journeyService.ts
import { JourneyDefinitionsApi } from "../api";
import { apiConfig } from "./apiConfig";
import { validateJourneyDefinition } from "../utils/validation";

const api = new JourneyDefinitionsApi(apiConfig);

// Existing create method
export const createJourneyDefinition = (data: any) => {
    return api.createJourneyDefinition(data);
};

// Add new methods
export const listJourneyDefinitions = async () => {
    try {
        const response = await api.listJourneyDefinitions();
        return response.map(transformJourneyToListItem);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const getJourneyDefinitionsByCode = async (journeyCode: string) => {
    try {
        const response = await api.getJourneyDefinitionsByCode({ journeyCode });
        return response;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

// Helper functions
const transformJourneyToListItem = (journey: JourneyDefinitionResponse): JourneyDefinitionListItem => {
    return {
        id: journey.id,
        journeyCode: journey.journeyCode,
        name: journey.name,
        version: journey.version,
        active: journey.active,
        createdAt: journey.createdAt
    };
};

const handleApiError = (error: any) => {
    console.error('API Error:', error);
    // Add error logging and user notification logic here
};
```

### 5. Add Routing

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JourneyDefinitionsPage } from './pages/JourneyDefinitionsPage';
import { JourneyDetailsPage } from './pages/JourneyDetailsPage';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="app-nav">
          <a href="/journey-definitions">Journey Definitions</a>
        </nav>
        
        <main className="app-main">
          <Routes>
            <Route path="/journey-definitions" element={<JourneyDefinitionsPage />} />
            <Route path="/journeys/:journeyCode" element={<JourneyDetailsPage />} />
            <Route path="/" element={<JourneyDefinitionsPage />} />
          </Routes>
        </main>
        
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

## Testing Guide

### 1. Unit Tests

```typescript
// src/components/__tests__/JourneyDefinitionList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { JourneyDefinitionList } from '../JourneyDefinitionList';
import { mockJourneys } from '../../__mocks__/journey.mocks';

describe('JourneyDefinitionList', () => {
  it('renders journey list correctly', () => {
    render(
      <JourneyDefinitionList
        journeys={mockJourneys}
        loading={false}
        onCreateJourney={jest.fn()}
      />
    );

    expect(screen.getByText('Test Journey 1')).toBeInTheDocument();
    expect(screen.getByText('Test Journey 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <JourneyDefinitionList
        journeys={[]}
        loading={true}
        onCreateJourney={jest.fn()}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows empty state when no journeys', () => {
    render(
      <JourneyDefinitionList
        journeys={[]}
        loading={false}
        onCreateJourney={jest.fn()}
      />
    );

    expect(screen.getByText('No journey definitions found')).toBeInTheDocument();
  });
});
```

### 2. Service Tests

```typescript
// src/services/__tests__/journeyService.test.ts
import { journeyService } from '../journeyService';
import { mockApi } from '../../__mocks__/api.mocks';

describe('journeyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list journey definitions', async () => {
    const mockResponse = [{ id: '1', name: 'Test Journey' }];
    mockApi.listJourneyDefinitions.mockResolvedValue(mockResponse);

    const result = await journeyService.listJourneyDefinitions();

    expect(result).toEqual(mockResponse);
    expect(mockApi.listJourneyDefinitions).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    mockApi.listJourneyDefinitions.mockRejectedValue(new Error('API Error'));

    await expect(journeyService.listJourneyDefinitions()).rejects.toThrow('API Error');
  });
});
```

### 3. Integration Tests

```typescript
// src/__tests__/journey-definitions.integration.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { JourneyDefinitionsPage } from '../pages/JourneyDefinitionsPage';
import { mockApi } from '../__mocks__/api.mocks';

describe('Journey Definitions Integration', () => {
  it('should load and display journeys', async () => {
    mockApi.listJourneyDefinitions.mockResolvedValue([
      { id: '1', name: 'Test Journey', journeyCode: 'TEST', version: 1 }
    ]);

    render(
      <MemoryRouter>
        <JourneyDefinitionsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Journey')).toBeInTheDocument();
    });
  });

  it('should create new journey', async () => {
    mockApi.listJourneyDefinitions.mockResolvedValue([]);
    mockApi.createJourneyDefinition.mockResolvedValue({
      id: '2',
      name: 'New Journey',
      journeyCode: 'NEW',
      version: 1
    });

    render(
      <MemoryRouter>
        <JourneyDefinitionsPage />
      </MemoryRouter>
    );

    // Click create button
    fireEvent.click(screen.getByText('Create Journey'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Journey Code'), {
      target: { value: 'NEW' }
    });
    fireEvent.change(screen.getByLabelText('Journey Name'), {
      target: { value: 'New Journey' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByText('Journey created successfully!')).toBeInTheDocument();
    });
  });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test JourneyDefinitionList
```

## Development Tips

### 1. Performance Optimization

```typescript
// Use React.memo for components
export const JourneyDefinitionCard = React.memo(({ journey, onClick }) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const filteredJourneys = useMemo(() => {
  return journeys.filter(j => j.name.includes(searchQuery));
}, [journeys, searchQuery]);

// Use useCallback for event handlers
const handleJourneyClick = useCallback((journeyId: string) => {
  navigate(`/journeys/${journeyId}`);
}, [navigate]);
```

### 2. Error Handling

```typescript
// Create error boundary
class JourneyDefinitionsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Journey Definitions Error:', error, errorInfo);
    // Log to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with Journey Definitions.</div>;
    }

    return this.props.children;
  }
}
```

### 3. Accessibility

```typescript
// Add ARIA labels
<button
  aria-label="Create new journey definition"
  onClick={onCreateJourney}
>
  Create Journey
</button>

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    onClick();
  }
};

// Focus management
useEffect(() => {
  if (isModalOpen) {
    modalRef.current?.focus();
  }
}, [isModalOpen]);
```

## Common Issues and Solutions

### 1. API Integration Issues

**Problem**: CORS errors when calling API
**Solution**: Ensure API server allows requests from your development domain

**Problem**: Generated client not working
**Solution**: Check that API base URL is correctly configured in environment variables

### 2. Performance Issues

**Problem**: Slow rendering with large journey lists
**Solution**: Implement virtual scrolling or pagination

**Problem**: Excessive re-renders
**Solution**: Use React.memo, useMemo, and useCallback appropriately

### 3. State Management Issues

**Problem**: State not updating after API calls
**Solution**: Ensure proper async/await usage and error handling

**Problem**: Race conditions in API calls
**Solution**: Implement request cancellation and loading state management

## Deployment

### 1. Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### 2. Environment Configuration

```env
# Production environment variables
VITE_API_BASE_URL=https://api.journey-orchestrator.com
VITE_ENABLE_JOURNEY_DEFINITIONS=true
```

### 3. Performance Optimization

- Enable code splitting
- Optimize bundle size
- Implement service worker for caching
- Configure CDN for static assets

## Next Steps

1. **Add Advanced Features**: Search, filtering, sorting
2. **Implement Visual Editor**: React Flow integration for journey design
3. **Add Testing**: Increase test coverage to 90%+
4. **Performance Monitoring**: Add performance metrics and monitoring
5. **Documentation**: Create comprehensive API documentation

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vite.dev/)
- [Testing Library Documentation](https://testing-library.com/)

## Support

For questions or issues:
1. Check the existing documentation
2. Search GitHub issues
3. Create a new issue with detailed description
4. Contact the development team
