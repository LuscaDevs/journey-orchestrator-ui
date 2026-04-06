# Journey Definitions Feature Specification

## Feature Name

Journey Definitions Management

## Objective

Allow users to manage journey definitions used by the Journey Orchestrator.

A Journey Definition represents the blueprint of a workflow composed of:

* states
* transitions
* an initial state
* optional final states

Users must be able to:

* list journey definitions
* create new journey definitions
* view journey details

---

# Domain Concepts

## Journey Definition

A Journey Definition describes the lifecycle of a business workflow.

Example:

START → ANALYSIS → APPROVED → DISBURSEMENT → END

A journey definition contains:

* id
* name
* version
* states
* transitions
* initialState

---

# API Contract

All API interactions MUST use the generated client from:

api-contract/openapi.yaml

The frontend MUST NOT implement manual HTTP calls.

Use the generated API client located in:

src/api

---

## Required Endpoints

### List Journey Definitions

GET /journey-definitions

Response:

* list of journey definitions
* each containing id, name and version

---

### Create Journey Definition

POST /journey-definitions

Payload:

* name
* states
* transitions
* initialState

---

### Get Journey Definition Details

GET /journey-definitions/{id}

Returns the complete journey definition.

---

# User Interface

## Page

JourneyDefinitionsPage

This page is responsible for:

* displaying all journey definitions
* allowing the creation of new journey definitions
* navigating to journey details

---

## Components

### JourneyDefinitionsPage

Main container page.

Responsibilities:

* fetch journey definitions
* render the list component
* provide create button

---

### JourneyDefinitionList

Displays the list of journey definitions.

Each item should display:

* journey name
* version
* identifier

Each item must allow navigation to:

JourneyDetailsPage

---

### JourneyDefinitionCard

Visual representation of a single journey definition.

Fields:

* name
* version

Optional actions:

* view details

---

### CreateJourneyDefinitionButton

Button that opens a creation form.

---

### CreateJourneyDefinitionModal

Modal dialog used to create a journey definition.

Fields required:

* name
* initialState

States and transitions can initially be empty.

These will later be edited in the visual editor.

---

# UI Behavior

## Page Load

When the page loads:

1. Fetch journey definitions
2. Display list
3. Show empty state if none exist

---

## Create Journey

User clicks:

Create Journey

System opens creation modal.

User provides:

* name
* initialState

System sends request to backend.

On success:

* modal closes
* list refreshes

---

# Error Handling

If API fails:

Display an error message.

Example:

"Unable to load journey definitions."

If creation fails:

Display error message in modal.

---

# Empty State

If no journey definitions exist:

Display message:

"No journey definitions found."

Show button:

Create Journey

---

# Loading State

During API calls:

Display loading indicator.

---

# Navigation

Clicking a journey definition must navigate to:

/journeys/{id}

Which will display the Journey Details Page.

---

# Technical Constraints

Frontend stack:

React
TypeScript
Vite

API calls MUST use the generated client.

Location:

src/api

Service layer should be implemented in:

src/services

---

# Future Extensions

This feature will later integrate with a visual journey editor.

The editor will allow:

* editing states
* defining transitions
* visualizing the workflow graph

The editor will likely use:

React Flow

States and transitions created here must be compatible with that editor.

---

# Acceptance Criteria

The feature is considered complete when:

1. User can open the Journey Definitions page
2. User can see a list of journey definitions
3. User can create a new journey definition
4. Newly created journey appears in the list
5. User can navigate to journey details

---

# Out of Scope

Not part of this feature:

* editing states
* editing transitions
* visual workflow editor
* journey execution

These will be implemented in future specifications.
