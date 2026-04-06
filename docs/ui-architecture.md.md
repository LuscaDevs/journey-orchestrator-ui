# Journey Orchestrator UI Architecture

## Overview

This project provides a web interface for managing and executing journey workflows in the Journey Orchestrator backend.

The UI allows users to:

* Manage journey definitions
* Visually edit workflow states and transitions
* Execute journey instances
* Inspect execution history

The frontend communicates with the backend through the OpenAPI contract defined in:

```
/api-contract/openapi.yaml
```

---

# Technology Stack

## Framework

* React
* TypeScript
* Vite

## Libraries

UI Components

* Material UI

Graph Editor

* React Flow

HTTP Client

* Axios

Routing

* React Router

---

# Architectural Principles

The frontend follows these principles:

### Spec Driven Development

All features must be defined in `/frontend-spec` before implementation.

### Feature Based Structure

Source code will be organized by feature instead of technical layers.

Example:

```
src
 ├─ features
 │   ├─ journeys
 │   └─ instances
 │
 ├─ components
 ├─ services
 └─ models
```

### Backend Contract Driven

All API integrations must strictly follow the contract defined in:

```
/api-contract/openapi.yaml
```

---

# UI Modules

The UI is divided into the following main modules:

## Journey Definitions

Manage journey definitions.

Capabilities:

* List definitions
* Create definitions
* Edit workflows
* Define states and transitions
* Define conditional transitions

## Journey Instances

Monitor workflow executions.

Capabilities:

* List instances
* View execution state
* View execution history
* Trigger transitions

---

# Primary Screens

The application will include the following screens:

1. Journey Definitions List
2. Create Journey Definition
3. Journey Editor (Graph Editor)
4. Journey Instances List
5. Journey Instance Details

---

# Graph Editor

The workflow editor is the core component of the UI.

It allows users to visually model workflows using nodes and edges.

Node Types:

* Initial state
* Intermediate state
* Final state

Edges represent transitions between states.

Transitions may include conditional expressions.

Example condition:

```
context.score > 700
```

The editor will be implemented using **React Flow**.

---

# Future Enhancements

Possible future features:

* Simulation mode
* Journey versioning visualization
* Execution timeline visualization
* Metrics dashboards
