# Journey Definitions Management - Data Model

## Entity Overview

The Journey Definitions Management feature revolves around three core entities: Journey Definitions, States, and Transitions. These entities form the blueprint for workflow orchestration.

## Core Entities

### Journey Definition

**Purpose**: Represents a complete workflow blueprint with states, transitions, and metadata.

**Properties**:
```typescript
interface JourneyDefinition {
  id: string;                    // Unique identifier (UUID)
  journeyCode: string;           // Business identifier for the journey
  name: string;                  // Human-readable journey name
  version: number;               // Version number (integer)
  states: State[];               // Array of state definitions
  transitions: Transition[];    // Array of transition definitions
  active: boolean;              // Whether this version is active
  createdAt: string;           // ISO 8601 timestamp
}
```

**Validation Rules**:
- `journeyCode`: Required, alphanumeric, max 50 chars
- `name`: Required, min 3 chars, max 200 chars
- `version`: Required, positive integer
- `states`: Required, at least one INITIAL state
- `transitions`: Required, must connect defined states

**Business Rules**:
- Each journey must have exactly one INITIAL state
- Each journey must have at least one FINAL state
- Transitions must reference existing states
- Version numbers must be sequential

### State

**Purpose**: Represents a specific position in the workflow journey.

**Properties**:
```typescript
interface State {
  name: string;                 // Unique state name within journey
  type: StateType;             // State classification
}
```

**State Types**:
```typescript
enum StateType {
  INITIAL = 'INITIAL',       // Starting point of journey
  INTERMEDIATE = 'INTERMEDIATE', // Processing states
  FINAL = 'FINAL'            // End points of journey
}
```

**Validation Rules**:
- `name`: Required, alphanumeric with underscores, max 100 chars
- `type`: Required, must be valid StateType enum value
- State names must be unique within a journey

**Business Rules**:
- Exactly one state must have type INITIAL
- At least one state must have type FINAL
- State names should follow UPPER_SNAKE_CASE convention

### Transition

**Purpose**: Defines movement between states triggered by events.

**Properties**:
```typescript
interface Transition {
  source: string;              // Source state name
  event: string;               // Event trigger name
  target: string;              // Target state name
  condition?: string;          // Optional SpEL expression
}
```

**Validation Rules**:
- `source`: Required, must reference existing state name
- `event`: Required, alphanumeric with underscores, max 100 chars
- `target`: Required, must reference existing state name
- `condition`: Optional, valid SpEL expression if provided

**Business Rules**:
- Source and target states must be different
- Event names must be unique within source state
- Conditions must evaluate to boolean expressions
- Self-transitions are allowed but should be documented

## Data Relationships

### Entity Relationship Diagram

```
Journey Definition (1) -----> (*) State
    |
    |
    -----> (*) Transition
                |
                |---> (1) State (source)
                |
                '---> (1) State (target)
```

### Relationship Rules

1. **Journey Definition → States**: One-to-many relationship
   - Each journey contains multiple states
   - States belong to exactly one journey

2. **Journey Definition → Transitions**: One-to-many relationship
   - Each journey contains multiple transitions
   - Transitions belong to exactly one journey

3. **Transition → States**: Many-to-one relationships
   - Each transition references exactly one source state
   - Each transition references exactly one target state
   - States can have multiple incoming/outgoing transitions

## State Machine Model

### State Transition Rules

The journey follows a deterministic state machine model:

1. **Initial State**: Journey starts here
2. **Event Processing**: Events trigger state transitions
3. **Conditional Transitions**: Optional conditions determine if transition occurs
4. **Final States**: Journey terminates when reaching final state

### Transition Validation

```typescript
interface TransitionValidation {
  isValidTransition: boolean;
  errorMessage?: string;
  allowedEvents: string[];
}
```

**Validation Logic**:
- Verify source state exists
- Verify target state exists
- Check if event is valid for source state
- Evaluate condition if present
- Prevent circular dependencies

## API Data Models

### Create Journey Definition Request

```typescript
interface CreateJourneyDefinitionRequest {
  journeyCode: string;
  name: string;
  version: number;
  states: State[];
  transitions: Transition[];
}
```

### Journey Definition Response

```typescript
interface JourneyDefinitionResponse {
  id: string;
  journeyCode: string;
  name: string;
  version: number;
  states: State[];
  transitions: Transition[];
  active: boolean;
  createdAt: string;
}
```

## Frontend Data Models

### UI State Models

```typescript
// Journey List Item (for display)
interface JourneyDefinitionListItem {
  id: string;
  journeyCode: string;
  name: string;
  version: number;
  active: boolean;
  createdAt: string;
}

// Create Journey Form Data
interface CreateJourneyFormData {
  journeyCode: string;
  name: string;
  initialState: string;
}

// Journey Details View Model
interface JourneyDefinitionDetails extends JourneyDefinition {
  isEditable: boolean;
  hasInstances: boolean;
  transitionGraph: TransitionGraph;
}
```

### Component Props Models

```typescript
// Journey Definition List Props
interface JourneyDefinitionListProps {
  journeys: JourneyDefinitionListItem[];
  loading: boolean;
  error?: string;
  onJourneyClick: (journeyId: string) => void;
  onCreateJourney: () => void;
}

// Journey Definition Card Props
interface JourneyDefinitionCardProps {
  journey: JourneyDefinitionListItem;
  onClick: (journeyId: string) => void;
  variant?: 'default' | 'compact';
}

// Create Journey Modal Props
interface CreateJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJourneyFormData) => Promise<void>;
  loading: boolean;
  error?: string;
}
```

## Data Validation

### Client-Side Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

**Validation Rules**:

1. **Journey Code Validation**
   - Required
   - Alphanumeric and underscores only
   - 3-50 characters
   - Unique across all journeys

2. **Journey Name Validation**
   - Required
   - 3-200 characters
   - No special characters except spaces and hyphens

3. **State Validation**
   - At least one INITIAL state
   - At least one FINAL state
   - Unique state names within journey
   - Valid state types

4. **Transition Validation**
   - Source and target states must exist
   - Event names unique within source state
   - No circular dependencies
   - Valid SpEL expressions for conditions

## Data Persistence

### Storage Considerations

1. **Journey Definitions**: Stored in backend database
2. **State Transitions**: Logged for audit and debugging
3. **Version History**: Maintained for rollback capability
4. **Active Versions**: Marked for current use

### Performance Optimizations

1. **Caching Strategy**
   - Journey definitions cached for 5 minutes
   - State transition rules cached in memory
   - Version lookup optimized with indexes

2. **Pagination**
   - List journeys with pagination (20 items per page)
   - Search and filter capabilities
   - Lazy loading for large datasets

## Security Considerations

### Data Access Control

1. **Read Access**: All authenticated users can view journey definitions
2. **Create Access**: Restricted to authorized roles
3. **Update Access**: Restricted to journey owners or admins
4. **Delete Access**: Soft delete with audit trail

### Input Validation

1. **SQL Injection**: Use parameterized queries
2. **XSS Prevention**: Sanitize all user inputs
3. **SpEL Injection**: Validate condition expressions
4. **Data Sanitization**: Strip malicious content

## Migration Strategy

### Data Versioning

1. **Schema Evolution**: Support backward-compatible changes
2. **Migration Scripts**: Automated data transformation
3. **Rollback Capability**: Revert to previous versions
4. **Validation**: Ensure data integrity during migration

### Compatibility

1. **API Versioning**: Support multiple API versions
2. **Data Format**: Maintain backward compatibility
3. **Client Updates**: Gradual rollout of new features
4. **Deprecation**: Clear deprecation timeline for old versions
