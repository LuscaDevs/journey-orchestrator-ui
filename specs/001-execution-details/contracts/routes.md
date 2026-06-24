# Route Contract: Journey Instance Details

**Feature**: 001-execution-details  
**Date**: 2025-06-24

## Route Definition

### Path

```
/journey-instances/:instanceId
```

### Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| instanceId | string (UUID) | Unique identifier of the journey instance | Must be valid UUID format |

### Access Method

- Navigation from Journey Instances list via "Visualizar Detalhes" button
- Direct URL access (bookmarking/sharing)

## Page Contract

### JourneyInstanceDetailsPage

**Purpose**: Display comprehensive details of a journey instance execution with visual flow diagram.

**Props**: None (uses route parameter)

**State**:
- `loading`: boolean - Initial data fetch in progress
- `error`: string | null - Error message if fetch failed
- `instance`: JourneyInstanceResponse | null - Instance data
- `definition`: JourneyDefinitionResponse | null - Journey definition
- `history`: TransitionHistoryEventResponse[] - Transition history (paginated)
- `executionNodeStates`: Map<string, ExecutionNodeState> - Derived state for each node

**Behavior**:
- On mount: Fetch instance, definition, and history
- On error: Display error message with redirect option
- On success: Render all sections (info, flow, history, context)
- Support refresh/retry on error

## Component Contracts

### ExecutionFlowViewer

**Purpose**: Render read-only React Flow diagram with node execution states.

**Props**:
```typescript
interface ExecutionFlowViewerProps {
  definition: JourneyDefinitionResponse
  executionNodeStates: Map<string, ExecutionNodeState>
}
```

**Behavior**:
- Render React Flow in read-only mode (no drag/drop, no editing)
- Color nodes based on executionNodeStates
- Display icons based on execution status
- Enable zoom/pan for navigation
- Disable selection and interaction

### ExecutionInfoPanel

**Purpose**: Display general information about the journey instance.

**Props**:
```typescript
interface ExecutionInfoPanelProps {
  instance: JourneyInstanceResponse
  definition: JourneyDefinitionResponse
}
```

**Behavior**:
- Display: instanceId, journeyCode, version, status, currentState, createdAt, updatedAt
- Format dates in user-friendly format
- Display status badges with appropriate colors

### ExecutionHistoryTimeline

**Purpose**: Display chronological timeline of transition history.

**Props**:
```typescript
interface ExecutionHistoryTimelineProps {
  history: TransitionHistoryEventResponse[]
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}
```

**Behavior**:
- Render vertical timeline with transition entries
- Each entry shows: timestamp, event, fromState, toState
- Support pagination with "Load More" button
- Show loading state during pagination
- Display empty state when no history exists

### ExecutionContextViewer

**Purpose**: Display execution context variables in JSON format.

**Props**:
```typescript
interface ExecutionContextViewerProps {
  context: Record<string, any> | null
}
```

**Behavior**:
- Render formatted JSON with syntax highlighting
- Support copy-to-clipboard functionality
- Display empty state when context is null/empty
- Handle large objects with collapse/expand

## Hook Contract

### useJourneyInstanceDetails

**Purpose**: Fetch and aggregate journey instance details data.

**Parameters**:
```typescript
interface UseJourneyInstanceDetailsParams {
  instanceId: string
}
```

**Returns**:
```typescript
interface UseJourneyInstanceDetailsReturn {
  data: {
    instance: JourneyInstanceResponse | null
    definition: JourneyDefinitionResponse | null
    history: TransitionHistoryEventResponse[]
    executionNodeStates: Map<string, ExecutionNodeState>
  }
  loading: boolean
  error: string | null
  refetch: () => void
  loadMoreHistory: () => void
  hasMoreHistory: boolean
}
```

**Behavior**:
- Fetch JourneyInstance by instanceId
- Fetch JourneyDefinition by journeyDefinitionId and journeyVersion
- Fetch TransitionHistory with pagination (default 50 items)
- Derive executionNodeStates from history and current state
- Handle 404 errors for instance or definition
- Support refetch for manual refresh
- Support pagination for history

## Error Contract

### Error States

| Error Type | Display | User Action |
|------------|---------|-------------|
| Instance not found (404) | "Instância não encontrada" | Redirect to list |
| Definition not found (404) | "Definição da jornada não encontrada" | Display error, stay on page |
| Network error | "Erro de conexão" | Retry button |
| Invalid instanceId | "ID de instância inválido" | Redirect to list |

### Error Handling

- All errors displayed with user-friendly messages
- Retry option for transient errors
- Redirect for permanent errors (404)
- Toast notifications for background errors
