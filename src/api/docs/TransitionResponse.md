# TransitionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**source** | **string** | Source state reference by name (legacy) | [optional] [default to undefined]
**target** | **string** | Target state reference by name (legacy) | [optional] [default to undefined]
**sourceStateId** | **string** | Source state reference by ID (new). Populated when available. | [optional] [default to undefined]
**targetStateId** | **string** | Target state reference by ID (new). Populated when available. | [optional] [default to undefined]
**event** | **string** |  | [optional] [default to undefined]
**condition** | **string** | Optional SpEL expression for conditional transitions | [optional] [default to undefined]

## Example

```typescript
import { TransitionResponse } from './api';

const instance: TransitionResponse = {
    source,
    target,
    sourceStateId,
    targetStateId,
    event,
    condition,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
