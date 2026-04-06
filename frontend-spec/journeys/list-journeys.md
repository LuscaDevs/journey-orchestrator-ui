# Feature: List Journey Definitions

## Description

Displays all journey definitions registered in the system.

Users can view, edit, or delete journey definitions.

---

# User Story

As a product architect
I want to view all journey definitions
So that I can manage workflow configurations.

---

# Screen

Journey Definitions List

---

# API

GET /journey-definitions

---

# UI Layout

The screen displays a table containing all journey definitions.

Columns:

* Journey Definition ID
* Version
* Status
* Actions

---

# Table Example

| Journey Definition ID | Version | Status | Actions |
| --------------------- | ------- | ------ | ------- |
| CREDIT_FLOW           | 1       | ACTIVE | Edit    |
| LOAN_FLOW             | 1       | DRAFT  | Edit    |

---

# Actions

Each row supports the following actions:

Edit
Opens the journey editor.

Delete
Removes the journey definition.

View
Opens a read-only visualization of the workflow.

---

# Navigation

Buttons:

Create Journey

Redirects to:

```
/journeys/new
```

---

# Empty State

If no journey definitions exist:

Display message:

```
No journey definitions found.
```

And show button:

```
Create Journey
```

---

# Error Handling

If the API request fails:

Display message:

```
Failed to load journey definitions.
```
