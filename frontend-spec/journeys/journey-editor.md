# Feature: Journey Editor

## Description

Provides a visual editor for defining journey workflows.

Users can create states and transitions between them.

---

# User Story

As a product architect
I want to visually design journey workflows
So that I can configure product orchestration flows.

---

# Screen

Journey Graph Editor

---

# APIs

GET /journey-definitions/{id}

PUT /journey-definitions/{id}

---

# Layout

The screen is divided into two areas.

Left side

Graph editor canvas.

Right side

Properties panel for selected node or transition.

---

# Graph Editor

The graph editor allows users to manipulate workflow structures.

Operations supported:

* Add state
* Remove state
* Connect states
* Remove transition
* Define transition condition

---

# Node Types

Initial State

Represents the starting point of the workflow.

Intermediate State

Represents an intermediate processing stage.

Final State

Represents the end of the workflow.

---

# Transition

A transition connects two states.

Example:

```
PROPOSAL -> APPROVED
```

---

# Conditional Transition

Transitions may include conditions.

Example:

```
context.score > 700
```

---

# Example Workflow

```
START -> SIMULATION -> PROPOSAL
                         |
                         v
                      APPROVED
```

---

# Properties Panel

Selecting a node opens the node properties.

Node properties:

* Name
* Type

Selecting an edge opens transition properties.

Transition properties:

* Source state
* Target state
* Condition expression

---

# Save Behavior

Clicking Save sends the updated workflow definition to the backend.

```
PUT /journey-definitions/{id}
```

---

# Validation Rules

A workflow must include:

* One initial state
* At least one final state
* Valid transitions

---

# Error Handling

If saving fails:

Display error message returned by the API.
