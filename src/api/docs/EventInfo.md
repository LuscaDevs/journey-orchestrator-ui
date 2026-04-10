# EventInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | Type of the event that triggered the transition | [default to undefined]
**data** | **{ [key: string]: any; }** | Event-specific data | [optional] [default to undefined]

## Example

```typescript
import { EventInfo } from './api';

const instance: EventInfo = {
    type,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
