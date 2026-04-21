# PaginationInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**limit** | **number** | Number of events returned in this page | [optional] [default to undefined]
**offset** | **number** | Number of events skipped | [optional] [default to undefined]
**hasNext** | **boolean** | Whether there are more events available | [optional] [default to undefined]
**hasPrevious** | **boolean** | Whether there are previous events available | [optional] [default to undefined]

## Example

```typescript
import { PaginationInfo } from './api';

const instance: PaginationInfo = {
    limit,
    offset,
    hasNext,
    hasPrevious,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
