# JourneyInstanceResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instanceId** | **string** |  | [optional] [default to undefined]
**journeyCode** | **string** |  | [optional] [default to undefined]
**version** | **number** |  | [optional] [default to undefined]
**currentState** | **string** |  | [optional] [default to undefined]
**status** | [**JourneyStatus**](JourneyStatus.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { JourneyInstanceResponse } from './api';

const instance: JourneyInstanceResponse = {
    instanceId,
    journeyCode,
    version,
    currentState,
    status,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
