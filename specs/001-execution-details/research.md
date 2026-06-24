# Research: Visualização Gráfica de Instância de Jornada (Execution Details)

**Feature**: 001-execution-details  
**Date**: 2025-06-24  
**Status**: Complete

## Overview

This document captures research findings and technical decisions for implementing the execution details visualization feature. The feature reuses existing React Flow infrastructure from the journey editor and adds execution-specific visual indicators.

## Technical Decisions

### React Flow for Execution Visualization

**Decision**: Reuse React Flow 11.11.4 from the journey editor for execution visualization.

**Rationale**: 
- React Flow is already integrated in the project for the journey editor
- Familiarity with the library reduces development time
- Consistent visual experience between editor and execution viewer
- React Flow supports custom node styling and edge rendering needed for execution states

**Alternatives Considered**:
- Custom canvas implementation: Would require more development effort and lack built-in features like zoom/pan
- Other diagram libraries (e.g., Cytoscape.js, D3.js): Would introduce additional dependency and learning curve

**Implementation Notes**:
- Create read-only React Flow instance (no drag/drop, no editing)
- Use custom node components to display execution state colors
- Disable interactive features (selection, dragging, connection creation)
- Enable zoom/pan for navigation in large diagrams

### State Color Mapping

**Decision**: Use color scheme: green (completed), blue (running), gray (pending), red (failed).

**Rationale**:
- Follows industry-standard semantic color conventions
- Matches the specification requirements
- Provides clear visual distinction between states
- Accessible for color-blind users when combined with icons

**Alternatives Considered**:
- Different color schemes (e.g., yellow/orange): Less standard for success/failure semantics
- Patterns/textures: Would be more complex to implement and less intuitive

**Implementation Notes**:
- Use TailwindCSS color tokens for consistency
- Add icons (CheckCircle for completed, Activity for running, Circle for pending, AlertCircle for failed)
- Apply border colors and background colors based on state

### API Data Fetching Strategy

**Decision**: Use existing API endpoints with new hook for data aggregation.

**Rationale**:
- Backend already provides JourneyInstance, JourneyDefinition, and TransitionHistory endpoints
- Existing API client infrastructure can be reused
- Minimal backend changes required
- Consistent error handling patterns

**Alternatives Considered**:
- New dedicated endpoint: Would require backend changes and add complexity
- WebSocket for real-time updates: Out of scope for v1 (read-only view)

**Implementation Notes**:
- Create `useJourneyInstanceDetails` hook
- Fetch JourneyInstance by ID
- Fetch JourneyDefinition by journeyDefinitionId and journeyVersion
- Fetch TransitionHistory with pagination support
- Aggregate data and provide to components

### Timeline Component for History

**Decision**: Custom timeline component using TailwindCSS.

**Rationale**:
- No existing timeline component in the project
- Simple vertical timeline can be built with TailwindCSS
- Avoids additional dependency
- Full control over styling and behavior

**Alternatives Considered**:
- Timeline library (e.g., react-vertical-timeline): Would add dependency for simple use case
- Table view: Less visually appealing for chronological data

**Implementation Notes**:
- Vertical timeline with left border line
- Timeline items with timestamp, event, from/to states
- Pagination support for large histories
- Empty state message when no history exists

### JSON Context Viewer

**Decision**: Pre-formatted JSON display with syntax highlighting.

**Rationale**:
- Simple implementation using `<pre>` tag
- No additional dependency required
- Readable for technical users
- Supports complex nested objects

**Alternatives Considered**:
- JSON editor library (e.g., react-json-view): Would add dependency for read-only use case
- Tree view component: More complex to implement

**Implementation Notes**:
- Use `<pre>` with JSON.stringify(data, null, 2)
- Add copy-to-clipboard functionality
- Handle empty context with message
- Collapse large objects by default if needed

### Routing Integration

**Decision**: Add route `/journey-instances/:instanceId` to existing React Router setup.

**Rationale**:
- React Router DOM 7.14.0 already in use
- Consistent with existing routing patterns
- Simple parameter extraction with useParams hook

**Alternatives Considered**:
- Query parameters: Less clean for hierarchical resource access
- Modal overlay: Would not support direct linking/bookmarking

**Implementation Notes**:
- Add route in App.tsx
- Create JourneyInstanceDetailsPage component
- Handle 404 (instance not found) with error state
- Add "View Details" button in JourneyInstancesTable

## Performance Considerations

### Large Diagrams

**Decision**: Implement virtualization or lazy loading for diagrams with 50+ states.

**Rationale**:
- React Flow can handle 50 states efficiently
- Beyond 50 states, performance may degrade
- Success criteria requires < 3s load time for 50 states

**Implementation Notes**:
- Monitor performance with React DevTools
- Consider React.memo for node components
- Lazy load transition history pagination

### Large History

**Decision**: Use pagination for transition history (API already supports it).

**Rationale**:
- API endpoint supports limit/offset parameters
- Success criteria requires support for 1000+ transitions
- Prevents memory issues and slow rendering

**Implementation Notes**:
- Default page size: 50 transitions
- Load more button for pagination
- Keep total count for display

## Dependencies

### Existing Dependencies to Reuse

- React Flow 11.11.4: Diagram rendering
- Zustand 5.0.12: State management (if needed for local component state)
- React Router DOM 7.14.0: Routing
- TailwindCSS 4.2.0: Styling
- Lucide React: Icons (CheckCircle, Activity, AlertCircle, Circle)
- React Hot Toast: Error notifications

### No New Dependencies Required

All required functionality can be implemented with existing dependencies.

## Open Questions Resolved

### Q: How to determine which states are "completed" vs "pending"?

**Answer**: Parse TransitionHistory to build a Set of visited state names. States in the set are completed, current state is running, others are pending.

### Q: How to handle journey definition versioning?

**Answer**: Use journeyVersion from JourneyInstance to fetch the correct JourneyDefinition version. The backend API supports versioned retrieval.

### Q: What if the journey definition was deleted after instance started?

**Answer**: Handle 404 error when fetching JourneyDefinition and display appropriate error message to user.

## Conclusion

All technical decisions have been made with rationale documented. No NEEDS CLARIFICATION items remain. The implementation can proceed with Phase 1 design.
