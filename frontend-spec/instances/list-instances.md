# Feature: List Journey Instances

## Description

Displays all workflow instances currently stored in the system.

---

# User Story

As an operator
I want to see running journey instances
So that I can monitor workflow execution.

---

# API

GET /journey-instances

---

# UI

Table columns:

* Instance ID
* Journey Definition ID
* Version
* Current State
* Status
* Created At

---

# Example

| Instance ID | Journey     | State    | Status  |
| ----------- | ----------- | -------- | ------- |
| 12345       | CREDIT_FLOW | PROPOSAL | RUNNING |

---

# Actions

View Details

Opens instance details screen.

---

# Empty State

Display:

```
No journey instances found.
```
