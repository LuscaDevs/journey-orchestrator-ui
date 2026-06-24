# Data Model: Visualização Gráfica de Instância de Jornada (Execution Details)

**Feature**: 001-execution-details  
**Date**: 2025-06-24  
**Status**: Complete

## Overview

This document describes the data model for the execution details visualization feature. The feature primarily uses existing backend entities with frontend-specific derived state for visualization.

## Entities

### JourneyInstance

**Description**: Represents a running or completed journey execution instance.

**Source**: Backend API (JourneyInstanceResponse)

**Fields**:
- `instanceId`: string - Unique identifier of the instance
- `journeyDefinitionId`: string - Reference to the journey definition
- `journeyVersion`: number - Version of the definition used for this instance
- `currentState`: string - Name of the current state
- `status`: JourneyStatus - RUNNING | COMPLETED | FAILED | CANCELLED
- `createdAt`: string (ISO 8601) - When the instance was started
- `updatedAt`: string (ISO 8601) - Last update timestamp
- `context`: Map<string, object> - Execution context variables

**Relationships**:
- References JourneyDefinition via journeyDefinitionId and journeyVersion
- Has many TransitionHistoryEntry

**Validation Rules**:
- instanceId must be non-empty
- journeyDefinitionId must be non-empty
- journeyVersion must be >= 1
- status must be one of the enum values

### JourneyDefinition

**Description**: Defines the structure of a journey workflow.

**Source**: Backend API (JourneyDefinitionResponse)

**Fields**:
- `id`: string - Unique identifier
- `journeyCode`: string - Business code for the journey
- `name`: string - Display name
- `version`: number - Version number
- `status`: JourneyDefinitionStatus - ATIVA | INATIVA | RASCUNHO
- `states`: State[] - List of states in the journey
- `transitions`: Transition[] - List of transitions between states
- `createdAt`: string (ISO 8601)
- `updatedAt`: string (ISO 8601)

**Relationships**:
- Has many State
- Has many Transition
- Referenced by JourneyInstance

**Validation Rules**:
- Must have at least one INITIAL state
- Must have at least one FINAL state
- All transitions must reference valid states

### State

**Description**: Represents a state/step in the journey.

**Source**: Backend API (State)

**Fields**:
- `id`: string (UUID) - Unique identifier
- `name`: string - State name
- `type`: StateType - INITIAL | INTERMEDIATE | FINAL
- `position`: Position - Visual position {x, y}

**Relationships**:
- Belongs to JourneyDefinition
- Source of many Transition
- Target of many Transition

**Validation Rules**:
- name must be non-empty
- type must be one of the enum values
- position must have valid x, y coordinates

### Transition

**Description**: Represents a transition between states.

**Source**: Backend API (TransitionResponse)

**Fields**:
- `sourceStateId`: string (UUID) - Source state reference
- `targetStateId`: string (UUID) - Target state reference
- `event`: string - Event that triggers the transition
- `condition`: string (optional) - SpEL expression for conditional transition

**Relationships**:
- Belongs to JourneyDefinition
- References State as source
- References State as target

**Validation Rules**:
- sourceStateId must reference a valid state
- targetStateId must reference a valid state
- event must be non-empty

### TransitionHistoryEntry

**Description**: Represents a historical transition that occurred during execution.

**Source**: Backend API (TransitionHistoryEventResponse)

**Fields**:
- `id`: string - Unique identifier
- `instanceId`: string - Reference to the journey instance
- `fromState`: string - Name of the state before transition
- `toState`: string - Name of the state after transition
- `event`: EventInfo - Event that triggered the transition
  - `type`: string - Event type
  - `data`: object - Event-specific data
- `timestamp`: string (ISO 8601) - When the transition occurred
- `metadata`: object - Additional context information
- `sequenceNumber`: number - Order for same-millisecond events

**Relationships**:
- Belongs to JourneyInstance

**Validation Rules**:
- instanceId must be non-empty
- timestamp must be valid ISO 8601
- sequenceNumber must be >= 0

## Derived State

### ExecutionNodeState

**Description**: Frontend-only derived state for visualizing node execution status.

**Fields**:
- `stateName`: string - Name of the state
- `executionStatus`: ExecutionNodeStatus - COMPLETED | RUNNING | PENDING | FAILED
- `visitedAt`: string (ISO 8601, optional) - When the state was first visited

**Derivation Logic**:
- COMPLETED: State appears in TransitionHistory as toState
- RUNNING: State equals JourneyInstance.currentState
- PENDING: State not in history and not current
- FAILED: State is current and JourneyInstance.status is FAILED

**Usage**: Used to color nodes in React Flow visualization

### ExecutionNodeStatus

**Description**: Enum for node execution status.

**Values**:
- `COMPLETED` - State has been visited (green)
- `RUNNING` - State is currently active (blue)
- `PENDING` - State has not been visited yet (gray)
- `FAILED` - State failed (red)

## State Transitions

### JourneyInstance Status Transitions

```
RUNNING → COMPLETED (when reaching FINAL state)
RUNNING → FAILED (when error occurs)
RUNNING → CANCELLED (when cancelled)
```

### ExecutionNodeStatus Transitions

```
PENDING → RUNNING (when state becomes current)
RUNNING → COMPLETED (when state is left)
RUNNING → FAILED (when instance status is FAILED)
```

## Data Flow

### Fetch Flow for Instance Details

1. User navigates to `/journey-instances/:instanceId`
2. Hook `useJourneyInstanceDetails` fetches:
   - JourneyInstance by instanceId
   - JourneyDefinition by journeyDefinitionId and journeyVersion
   - TransitionHistory by instanceId (with pagination)
3. Frontend derives ExecutionNodeState for each state
4. Components render with derived state

### Error Handling

- JourneyInstance not found: Display error, redirect to list
- JourneyDefinition not found: Display error (definition may have been deleted)
- TransitionHistory empty: Display empty state message
- Context empty: Display empty state message

## Performance Considerations

### Caching Strategy

- JourneyDefinition can be cached by (journeyDefinitionId, version)
- JourneyInstance should not be cached (status may change)
- TransitionHistory should be paginated to avoid large payloads

### Pagination

- TransitionHistory: Default 50 items per page
- Load more button for pagination
- Total count displayed for context

## Schema Validation

### Type Safety

All API responses are typed using generated TypeScript types from OpenAPI specification:
- JourneyInstanceResponse
- JourneyDefinitionResponse
- TransitionHistoryEventResponse

### Runtime Validation

- Validate instanceId format (UUID)
- Validate timestamps are valid ISO 8601
- Validate enum values are within allowed sets
