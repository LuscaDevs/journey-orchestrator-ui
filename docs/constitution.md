# Journey Orchestrator – Project Constitution

## 1. Specification Driven Development

All features MUST start from a specification.

Specifications live in:

* `frontend-spec/`
* `docs/`
* `api-contract/openapi.yaml`

Code must implement specifications and not precede them.

---

## 2. API Contract First

All APIs MUST be defined in the OpenAPI specification located at:

`api-contract/openapi.yaml`

Backend controllers and frontend clients MUST be generated from the OpenAPI contract.

Manual API definitions are not allowed.

---

## 3. Layered Architecture

Backend must follow:

Controller → Service → Domain → Repository

Frontend must follow:

Page → Component → Service → API Client

---

## 4. State Machine as Core Domain

Journey state transitions MUST be managed by a state machine.

Transitions must:

* validate allowed states
* produce audit logs
* guarantee consistency

---

## 5. Observability

All operations MUST produce logs containing:

* correlationId
* journeyInstanceId
* transitionId
* timestamp

---

## 6. Testability

Every feature MUST include:

* unit tests
* integration tests for APIs
* state transition validation

---

## 7. Evolution

Backward compatibility must be preserved for public APIs.

Breaking changes require a new API version.

---

## 8. Documentation

All architecture decisions must be documented in:

`docs/adr/`
