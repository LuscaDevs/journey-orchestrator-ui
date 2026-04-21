# TransitionHistoryListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instanceId** | **string** | ID of the journey instance | [optional] [default to undefined]
**events** | [**Array&lt;TransitionHistoryEventResponse&gt;**](TransitionHistoryEventResponse.md) |  | [optional] [default to undefined]
**pagination** | [**PaginationInfo**](PaginationInfo.md) |  | [optional] [default to undefined]
**totalCount** | **number** | Total number of events in history | [optional] [default to undefined]

## Example

```typescript
import { TransitionHistoryListResponse } from './api';

const instance: TransitionHistoryListResponse = {
    instanceId,
    events,
    pagination,
    totalCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
