# Journey Definitions Management

## Feature Overview

Allow users to manage journey definitions used by the Journey Orchestrator. A Journey Definition represents the blueprint of a workflow composed of states, transitions, an initial state, and optional final states.

## User Scenarios & Testing

### Primary User Scenarios

**Scenario 1: Browse Existing Journey Definitions**
- User navigates to the Journey Definitions page
- System displays a list of all available journey definitions
- Each journey shows name, version, and identifier
- User can click on any journey to view detailed information

**Scenario 2: Create New Journey Definition**
- User clicks "Create Journey" button
- System opens a modal dialog with required fields
- User enters journey name and initial state
- System validates input and creates the journey definition
- New journey appears in the list immediately

**Scenario 3: View Journey Details**
- User clicks on a journey definition from the list
- System navigates to journey details page
- User can view complete journey definition including all states and transitions

### Edge Cases & Error Scenarios

- Network connectivity issues during API calls
- Invalid user input during journey creation
- Empty journey definitions list
- Duplicate journey names
- Backend service unavailability

## Functional Requirements

### FR-001: List Journey Definitions
- The system SHALL display all available journey definitions in a list format
- Each list item SHALL show journey name, version, and unique identifier
- The system SHALL provide loading indicators while fetching data
- The system SHALL display appropriate error messages if the API call fails

### FR-002: Create Journey Definition
- The system SHALL provide a "Create Journey" button on the main page
- The system SHALL open a modal dialog when create button is clicked
- The modal SHALL require journey name and initial state as mandatory fields
- The system SHALL validate user input before submission
- The system SHALL create the journey definition via API call
- The system SHALL refresh the journey list after successful creation
- The system SHALL display error messages if creation fails

### FR-003: Navigate to Journey Details
- Each journey definition in the list SHALL be clickable
- The system SHALL navigate to journey details page when clicked
- The navigation SHALL use the route pattern `/journeys/{id}`

### FR-004: Handle Empty State
- The system SHALL display "No journey definitions found" message when list is empty
- The system SHALL show "Create Journey" button in empty state
- The system SHALL provide clear visual indication of empty state

### FR-005: Error Handling
- The system SHALL display user-friendly error messages for API failures
- The system SHALL provide retry mechanisms for transient failures
- The system SHALL not lose user input during modal errors

## Success Criteria

### Quantitative Metrics
- Journey list loads within 2 seconds for up to 100 definitions
- Journey creation completes within 3 seconds
- Page navigation completes within 1 second
- System achieves 99% uptime for journey definition operations

### Qualitative Measures
- Users can successfully create a journey definition without assistance
- Users can easily find and view existing journey definitions
- Error messages are clear and actionable
- Interface is intuitive and requires minimal training
- Users report satisfaction with the journey management workflow

### Task Completion Rates
- 95% of users successfully create their first journey definition
- 90% of users can locate specific journey definitions within 30 seconds
- 98% of journey creation attempts complete successfully
- 99% of page loads display journey definitions correctly

## Key Entities

### Journey Definition
- **id**: Unique identifier (UUID)
- **name**: Human-readable journey name
- **version**: Version string (e.g., "1.0.0")
- **states**: Array of state definitions
- **transitions**: Array of transition definitions
- **initialState**: ID of the starting state
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last modification

### State
- **id**: Unique state identifier
- **name**: Human-readable state name
- **type**: State type (start, intermediate, end)

### Transition
- **id**: Unique transition identifier
- **fromState**: Source state ID
- **toState**: Target state ID
- **condition**: Transition condition (optional)

## Assumptions

- API endpoints are available and properly configured
- User has appropriate permissions to manage journey definitions
- Generated API client is available in src/api directory
- React Flow integration will be implemented in future iterations
- Backend handles journey definition validation and persistence

## Dependencies

- OpenAPI specification at api-contract/openapi.yaml
- Generated API client in src/api
- Service layer implementation in src/services
- React/TypeScript frontend framework
- Vite build system

## Out of Scope

- Visual journey editor with drag-and-drop interface
- Journey execution and runtime management
- State and transition editing capabilities
- Journey versioning and history
- Journey templates and cloning
- Advanced journey validation rules
- Journey analytics and reporting

These features will be addressed in separate specifications following the project constitution.
