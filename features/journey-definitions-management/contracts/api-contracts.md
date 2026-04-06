# Journey Definitions Management - API Contracts

## API Interface Specification

This document defines the contracts between frontend components and the Journey Definitions API.

## Service Layer Contracts

### JourneyService Interface

```typescript
interface JourneyService {
  // Journey Definition Management
  listJourneyDefinitions(): Promise<JourneyDefinitionResponse[]>;
  createJourneyDefinition(request: CreateJourneyDefinitionRequest): Promise<JourneyDefinitionResponse>;
  getJourneyDefinitionsByCode(journeyCode: string): Promise<JourneyDefinitionResponse[]>;
  
  // Error Handling
  handleApiError(error: unknown): ApiError;
  
  // Validation
  validateJourneyDefinition(data: CreateJourneyDefinitionRequest): ValidationResult;
}
```

### Method Specifications

#### listJourneyDefinitions()

**Purpose**: Retrieve all journey definitions for display in the list view.

**Input**: None

**Output**: `Promise<JourneyDefinitionResponse[]>`

**Error Handling**:
- Network errors: Retry with exponential backoff
- Server errors: Display user-friendly message
- Timeout: Show loading state with retry option

**Performance Requirements**:
- Must complete within 2 seconds for up to 100 definitions
- Implement client-side caching for 5 minutes
- Support pagination for large datasets

#### createJourneyDefinition(request)

**Purpose**: Create a new journey definition with basic information.

**Input**: `CreateJourneyDefinitionRequest`

**Output**: `Promise<JourneyDefinitionResponse>`

**Validation**:
- Client-side validation before API call
- Server validation response handling
- Duplicate journey code detection

**Error Handling**:
- Validation errors: Display field-specific errors
- Conflict errors: Show duplicate code message
- Network errors: Allow retry with preserved input

#### getJourneyDefinitionsByCode(journeyCode)

**Purpose**: Retrieve all versions of a specific journey definition.

**Input**: `string journeyCode`

**Output**: `Promise<JourneyDefinitionResponse[]>`

**Error Handling**:
- Not found: Display appropriate message
- Invalid code: Show validation error
- Server errors: Retry mechanism

## Component Contracts

### JourneyDefinitionsPage Contract

```typescript
interface JourneyDefinitionsPageProps {
  // No props - container component
}

interface JourneyDefinitionsPageState {
  journeys: JourneyDefinitionListItem[];
  loading: boolean;
  error?: string;
  createModalOpen: boolean;
  searchQuery: string;
}

interface JourneyDefinitionsPageActions {
  loadJourneys(): Promise<void>;
  createJourney(data: CreateJourneyFormData): Promise<void>;
  navigateToJourney(journeyId: string): void;
  openCreateModal(): void;
  closeCreateModal(): void;
  setSearchQuery(query: string): void;
}
```

**Responsibilities**:
- Fetch and display journey definitions
- Handle create journey workflow
- Manage loading and error states
- Coordinate child components

**Lifecycle Methods**:
- `componentDidMount`: Load initial journey list
- `handleCreateJourney`: Process creation request
- `handleError`: Display appropriate error messages

### JourneyDefinitionList Contract

```typescript
interface JourneyDefinitionListProps {
  journeys: JourneyDefinitionListItem[];
  loading: boolean;
  error?: string;
  onJourneyClick: (journeyId: string) => void;
  onCreateJourney: () => void;
  emptyMessage?: string;
}

interface JourneyDefinitionListEvents {
  onJourneySelect: (journey: JourneyDefinitionListItem) => void;
  onCreateClick: () => void;
  onRetry: () => void;
}
```

**Display Requirements**:
- Show journey name, version, and creation date
- Support loading skeleton states
- Display empty state when no journeys exist
- Handle error states with retry option

**Performance Requirements**:
- Render 100+ items without performance degradation
- Implement virtual scrolling for large lists
- Smooth loading animations

### JourneyDefinitionCard Contract

```typescript
interface JourneyDefinitionCardProps {
  journey: JourneyDefinitionListItem;
  onClick: (journeyId: string) => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
  selected?: boolean;
}

interface JourneyDefinitionCardEvents {
  onClick: (journeyId: string) => void;
  onMouseEnter: (journeyId: string) => void;
  onMouseLeave: (journeyId: string) => void;
}
```

**Visual Requirements**:
- Clear visual hierarchy
- Hover states for interactivity
- Loading states for async operations
- Disabled state styling

**Accessibility Requirements**:
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management

### CreateJourneyModal Contract

```typescript
interface CreateJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJourneyFormData) => Promise<void>;
  loading: boolean;
  error?: string;
  initialData?: Partial<CreateJourneyFormData>;
}

interface CreateJourneyFormData {
  journeyCode: string;
  name: string;
  initialState: string;
}

interface CreateJourneyModalEvents {
  onSubmit: (data: CreateJourneyFormData) => void;
  onCancel: () => void;
  onFieldChange: (field: string, value: string) => void;
}
```

**Form Validation**:
- Real-time field validation
- Submit prevention for invalid data
- Clear error message display
- Field-level error indicators

**User Experience**:
- Smooth open/close animations
- Focus management on modal open
- Escape key to close modal
- Click outside to close (optional)

## Data Transfer Contracts

### API Response Contracts

#### Journey Definition List Response

```typescript
interface JourneyDefinitionListResponse {
  journeys: JourneyDefinitionResponse[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

#### Create Journey Response

```typescript
interface CreateJourneyResponse {
  journey: JourneyDefinitionResponse;
  warnings?: string[];
  validationErrors?: ValidationError[];
}
```

#### Error Response

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    correlationId: string;
  };
}
```

### Frontend State Contracts

#### Loading States

```typescript
interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

interface LoadingStates {
  journeysList: LoadingState;
  createJourney: LoadingState;
  journeyDetails: LoadingState;
}
```

#### Error States

```typescript
interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  errorCode?: string;
  retryable: boolean;
  retryCount: number;
}

interface ErrorStates {
  journeysList: ErrorState;
  createJourney: ErrorState;
  journeyDetails: ErrorState;
}
```

## Integration Contracts

### Routing Contract

```typescript
interface JourneyDefinitionsRoutes {
  '/journey-definitions': {
    component: JourneyDefinitionsPage;
    title: 'Journey Definitions';
    permissions: ['journey_definitions.read'];
  };
  
  '/journeys/:journeyCode': {
    component: JourneyDetailsPage;
    title: 'Journey Details';
    permissions: ['journey_definitions.read'];
    params: {
      journeyCode: string;
    };
  };
}
```

### Navigation Contract

```typescript
interface NavigationContract {
  navigateToJourneyList(): void;
  navigateToJourneyDetails(journeyCode: string): void;
  navigateToCreateJourney(): void;
  navigateBack(): void;
}
```

### Permission Contract

```typescript
interface PermissionContract {
  canReadJourneys: boolean;
  canCreateJourneys: boolean;
  canUpdateJourneys: boolean;
  canDeleteJourneys: boolean;
}

interface PermissionCheck {
  checkPermission(permission: string): boolean;
  requirePermission(permission: string): void;
}
```

## Performance Contracts

### Response Time Contracts

```typescript
interface PerformanceContracts {
  apiResponseTime: {
    listJourneys: 2000; // ms
    createJourney: 3000; // ms
    getJourneyDetails: 1000; // ms
  };
  
  uiResponseTime: {
    pageLoad: 1000; // ms
    modalOpen: 300; // ms
    listRender: 500; // ms
  };
  
  cacheDuration: {
    journeyList: 300000; // 5 minutes
    journeyDetails: 600000; // 10 minutes
  };
}
```

### Memory Usage Contracts

```typescript
interface MemoryContracts {
  maxJourneyListSize: 1000; // items
  maxCacheSize: 50; // MB
  componentMemoryLeakThreshold: 100; // MB
}
```

## Testing Contracts

### Unit Test Contracts

```typescript
interface TestContracts {
  componentTests: {
    JourneyDefinitionsPage: {
      shouldRender: boolean;
      shouldLoadJourneys: boolean;
      shouldHandleErrors: boolean;
      shouldCreateJourney: boolean;
    };
    
    JourneyDefinitionList: {
      shouldDisplayJourneys: boolean;
      shouldHandleEmptyState: boolean;
      shouldHandleLoadingState: boolean;
      shouldHandleErrorState: boolean;
    };
    
    CreateJourneyModal: {
      shouldValidateInput: boolean;
      shouldSubmitForm: boolean;
      shouldHandleErrors: boolean;
      shouldCloseOnCancel: boolean;
    };
  };
  
  serviceTests: {
    JourneyService: {
      shouldCallApiCorrectly: boolean;
      shouldHandleErrors: boolean;
      shouldValidateInput: boolean;
      shouldCacheResponses: boolean;
    };
  };
}
```

### Integration Test Contracts

```typescript
interface IntegrationTestContracts {
  userFlows: {
    createAndViewJourney: boolean;
    listAndNavigateToJourney: boolean;
    handleApiErrorsGracefully: boolean;
    maintainStateDuringNavigation: boolean;
  };
  
  performanceTests: {
    loadLargeJourneyList: boolean;
    handleRapidUserActions: boolean;
    maintainResponsivenessUnderLoad: boolean;
  };
}
```

## Security Contracts

### Data Validation Contracts

```typescript
interface SecurityContracts {
  inputValidation: {
    sanitizeUserInput: boolean;
    validateFieldLength: boolean;
    preventSqlInjection: boolean;
    preventXssAttacks: boolean;
  };
  
  apiSecurity: {
    useHttpsOnly: boolean;
    includeCorrelationId: boolean;
    handleAuthentication: boolean;
    handleAuthorization: boolean;
  };
}
```

### Error Handling Contracts

```typescript
interface ErrorHandlingContracts {
  errorBoundaries: {
    catchComponentErrors: boolean;
    logErrorDetails: boolean;
    showUserFriendlyMessage: boolean;
    provideRecoveryOptions: boolean;
  };
  
  apiErrorHandling: {
    retryFailedRequests: boolean;
    handleTimeouts: boolean;
    displayMeaningfulMessages: boolean;
    preserveUserInput: boolean;
  };
}
```

## Contract Evolution

### Versioning Strategy

1. **Interface Versioning**: Use semantic versioning for contracts
2. **Backward Compatibility**: Maintain compatibility for at least one major version
3. **Deprecation Policy**: Provide 3-month deprecation notice
4. **Migration Support**: Provide migration guides and tools

### Contract Testing

1. **Contract Tests**: Automated tests to verify contract compliance
2. **Consumer Testing**: Test from consumer perspective
3. **Provider Testing**: Test from provider perspective
4. **Integration Testing**: End-to-end contract validation

## Monitoring and Observability

### Performance Monitoring

```typescript
interface MonitoringContracts {
  metrics: {
    apiResponseTime: boolean;
    componentRenderTime: boolean;
    userInteractionLatency: boolean;
    errorRate: boolean;
  };
  
  logging: {
    userActions: boolean;
    apiCalls: boolean;
    errors: boolean;
    performance: boolean;
  };
}
```

### Health Checks

```typescript
interface HealthCheckContracts {
  apiAvailability: boolean;
  dataIntegrity: boolean;
  performanceThresholds: boolean;
  securityCompliance: boolean;
}
```
