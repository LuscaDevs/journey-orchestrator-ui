# Feature: Create Journey Definition

## Description

Allows the user to create a new journey definition.

---

# User Story

As a product architect
I want to create a journey definition
So that I can model a workflow for a product.

---

# Screen

Create Journey

---

# API

POST /journey-definitions

---

# Request Example

```
{
  "journeyDefinitionId": "CREDIT_FLOW",
  "version": 1
}
```

---

# Form Fields

Journey Definition ID

Type: string
Required: yes

Example:

```
CREDIT_FLOW
```

---

Version

Type: integer
Required: yes

Example:

```
1
```

---

# Buttons

Create
Submits the form and creates the journey.

Cancel
Returns to the journey definitions list.

---

# Success Behavior

After successful creation:

Redirect to:

```
/journeys/{id}/editor
```

---

# Error Handling

If the creation fails:

Display error message returned by the API.
