# TransitionHistoryEventResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the history event | [default to undefined]
**instanceId** | **string** | ID of the journey instance | [default to undefined]
**fromState** | **string** | Previous state before transition | [default to undefined]
**toState** | **string** | New state after transition | [default to undefined]
**event** | [**EventInfo**](EventInfo.md) |  | [default to undefined]
**timestamp** | **string** | When the transition occurred (ISO 8601) | [default to undefined]
**metadata** | **{ [key: string]: any; }** | Additional context information | [optional] [default to undefined]
**sequenceNumber** | **number** | Sequence number for ordering same-millisecond events | [optional] [default to undefined]

## Example

```typescript
import { TransitionHistoryEventResponse } from './api';

const instance: TransitionHistoryEventResponse = {
    id,
    instanceId,
    fromState,
    toState,
    event,
    timestamp,
    metadata,
    sequenceNumber,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
