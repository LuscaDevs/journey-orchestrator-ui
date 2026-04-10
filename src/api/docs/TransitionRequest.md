# TransitionRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**source** | **string** | Source state reference by name (legacy) | [default to undefined]
**target** | **string** | Target state reference by name (legacy) | [default to undefined]
**sourceStateId** | **string** | Source state reference by ID (new, preferred). Takes precedence if both source and sourceStateId are provided. | [optional] [default to undefined]
**targetStateId** | **string** | Target state reference by ID (new, preferred). Takes precedence if both target and targetStateId are provided. | [optional] [default to undefined]
**event** | **string** |  | [default to undefined]
**condition** | **string** | Optional SpEL expression for conditional transitions | [optional] [default to undefined]

## Example

```typescript
import { TransitionRequest } from './api';

const instance: TransitionRequest = {
    source,
    target,
    sourceStateId,
    targetStateId,
    event,
    condition,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
