# Tasks: Visualização Gráfica de Instância de Jornada (Execution Details)

**Input**: Design documents from `/specs/001-execution-details/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `src/` at repository root
- Paths shown below follow the web application structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create execution components directory structure in src/components/execution/
- [ ] T002 Create types for execution state in src/types/execution.types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Implement useJourneyInstanceDetails hook in src/hooks/useJourneyInstanceDetails.ts (fetches instance, definition, history, derives executionNodeStates)
- [ ] T004 Add route /journey-instances/:instanceId in src/App.tsx
- [ ] T005 Create JourneyInstanceDetailsPage shell in src/pages/JourneyInstanceDetailsPage.tsx (loading, error, empty states)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 4 - Informações Gerais da Instância (Priority: P1) 🎯 MVP

**Goal**: Display general information about the journey instance (ID, definition, version, status, state, dates)

**Independent Test**: Navigate to instance details page and verify all general info fields are displayed correctly

### Implementation for User Story 4

- [ ] T006 [US4] Create ExecutionInfoPanel component in src/components/execution/ExecutionInfoPanel.tsx (displays instanceId, journeyCode, version, status, currentState, createdAt, updatedAt)
- [ ] T007 [US4] Integrate ExecutionInfoPanel into JourneyInstanceDetailsPage in src/pages/JourneyInstanceDetailsPage.tsx
- [ ] T008 [US4] Add date formatting utilities in src/lib/dateUtils.ts (format dates in user-friendly format)
- [ ] T009 [US4] Add status badge component in src/components/ui/StatusBadge.tsx (displays status with appropriate colors)

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 4: User Story 1 - Visualização Gráfica da Execução (Priority: P1) 🎯 MVP

**Goal**: Render read-only React Flow diagram with nodes colored by execution state (completed/green, running/blue, pending/gray, failed/red)

**Independent Test**: Navigate to instance details page and verify the diagram renders with nodes colored correctly based on execution state

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create ExecutionFlowViewer component in src/components/execution/ExecutionFlowViewer.tsx (React Flow read-only instance)
- [ ] T011 [P] [US1] Create custom node component for execution states in src/components/execution/ExecutionNode.tsx (supports color and icon based on ExecutionNodeStatus)
- [ ] T012 [US1] Implement state derivation logic in src/lib/executionStateUtils.ts (derives ExecutionNodeState from history and current state)
- [ ] T013 [US1] Integrate ExecutionFlowViewer into JourneyInstanceDetailsPage in src/pages/JourneyInstanceDetailsPage.tsx
- [ ] T014 [US1] Add "Visualizar Detalhes" button in src/components/dashboard/JourneyInstancesTable.tsx (navigates to /journey-instances/:instanceId)
- [ ] T015 [US1] Configure React Flow for read-only mode in src/components/execution/ExecutionFlowViewer.tsx (disable drag/drop, selection, editing)
- [ ] T016 [US1] Add zoom/pan controls to ExecutionFlowViewer in src/components/execution/ExecutionFlowViewer.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 5: User Story 2 - Histórico de Transições (Priority: P2)

**Goal**: Display chronological timeline of transition history with pagination support

**Independent Test**: Navigate to instance details page and verify the timeline shows transitions in chronological order with pagination

### Implementation for User Story 2

- [ ] T017 [P] [US2] Create ExecutionHistoryTimeline component in src/components/execution/ExecutionHistoryTimeline.tsx (vertical timeline with transition entries)
- [ ] T018 [US2] Implement pagination logic in useJourneyInstanceDetails hook in src/hooks/useJourneyInstanceDetails.tsx (loadMoreHistory, hasMoreHistory)
- [ ] T019 [US2] Integrate ExecutionHistoryTimeline into JourneyInstanceDetailsPage in src/pages/JourneyInstanceDetailsPage.tsx
- [ ] T020 [US2] Add empty state for no history in src/components/execution/ExecutionHistoryTimeline.tsx
- [ ] T021 [US2] Add loading state for pagination in src/components/execution/ExecutionHistoryTimeline.tsx

**Checkpoint**: At this point, User Stories 1, 2, and 4 should all work independently

---

## Phase 6: User Story 3 - Contexto da Execução (Priority: P3)

**Goal**: Display execution context variables in JSON format with copy-to-clipboard

**Independent Test**: Navigate to instance details page and verify the context viewer displays JSON with copy functionality

### Implementation for User Story 3

- [ ] T022 [P] [US3] Create ExecutionContextViewer component in src/components/execution/ExecutionContextViewer.tsx (pre-formatted JSON display)
- [ ] T023 [US3] Add copy-to-clipboard functionality in src/components/execution/ExecutionContextViewer.tsx
- [ ] T024 [US3] Integrate ExecutionContextViewer into JourneyInstanceDetailsPage in src/pages/JourneyInstanceDetailsPage.tsx
- [ ] T025 [US3] Add empty state for no context in src/components/execution/ExecutionContextViewer.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Add error handling for 404 (instance not found) in src/pages/JourneyInstanceDetailsPage.tsx (display error, redirect to list)
- [ ] T027 [P] Add error handling for 404 (definition not found) in src/pages/JourneyInstanceDetailsPage.tsx (display error, stay on page)
- [ ] T028 [P] Add retry button for network errors in src/pages/JourneyInstanceDetailsPage.tsx
- [ ] T029 Add responsive layout for JourneyInstanceDetailsPage in src/pages/JourneyInstanceDetailsPage.tsx (grid layout for desktop, stacked for mobile)
- [ ] T030 Add loading skeleton for JourneyInstanceDetailsPage in src/pages/JourneyInstanceDetailsPage.tsx
- [ ] T031 Run quickstart.md validation to verify implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 4 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - No dependencies on other stories
  - User Story 3 (P3): Can start after Foundational - No dependencies on other stories
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

**Note**: User Stories 1 and 4 are both P1 and can be implemented in parallel. User Stories 2 and 3 can be implemented in any order after P1 stories.

### Within Each User Story

- Components can be created in parallel if marked [P]
- Integration tasks must wait for component completion
- Page integration must wait for all components in that story

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Components within a story marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create ExecutionFlowViewer component in src/components/execution/ExecutionFlowViewer.tsx"
Task: "Create custom node component for execution states in src/components/execution/ExecutionNode.tsx"

# Launch polish tasks together:
Task: "Add error handling for 404 (instance not found) in src/pages/JourneyInstanceDetailsPage.tsx"
Task: "Add error handling for 404 (definition not found) in src/pages/JourneyInstanceDetailsPage.tsx"
Task: "Add retry button for network errors in src/pages/JourneyInstanceDetailsPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 4 + 1 Only - Both P1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 4 (Informações Gerais)
4. Complete Phase 4: User Story 1 (Visualização Gráfica)
5. **STOP and VALIDATE**: Test User Stories 1 and 4 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 4 → Test independently → Deploy/Demo (MVP part 1!)
3. Add User Story 1 → Test independently → Deploy/Demo (MVP complete!)
4. Add User Story 2 → Test independently → Deploy/Demo
5. Add User Story 3 → Test independently → Deploy/Demo
6. Complete Polish → Final deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 4 (P1)
   - Developer B: User Story 1 (P1)
   - Developer C: User Story 2 (P2)
3. After P1 stories complete:
   - Developer A: User Story 3 (P3)
   - Developer B: Polish tasks
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are not included as they were not explicitly requested in the feature specification
