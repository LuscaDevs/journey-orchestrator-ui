# Feature: Journey Instance Details

## Description

Displays detailed information about a specific journey execution.

---

# User Story

As an operator
I want to inspect a workflow execution
So that I can understand the current state and history.

---

# API

GET /journey-instances/{id}

---

# Screen Sections

Instance Summary

Shows:

* Instance ID
* Journey Definition
* Version
* Current State
* Status
* Created At

---

Execution History

Displays the sequence of transitions executed.

Columns:

* Timestamp
* From State
* To State
* Transition

---

# Example History

| Timestamp | From       | To         |
| --------- | ---------- | ---------- |
| 10:02     | START      | SIMULATION |
| 10:03     | SIMULATION | PROPOSAL   |

---

# Visualization

A workflow graph highlights the current state.

---

# Actions

Advance

Triggers next transition.

Rollback

Moves execution back to a previous state.

Cancel

Terminates the instance.

---

# Error Handling

If the API fails:

Display error message returned by the backend.
