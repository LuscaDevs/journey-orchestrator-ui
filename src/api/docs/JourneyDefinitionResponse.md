# JourneyDefinitionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**journeyCode** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**version** | **number** |  | [optional] [default to undefined]
**states** | [**Array&lt;State&gt;**](State.md) |  | [optional] [default to undefined]
**transitions** | [**Array&lt;TransitionResponse&gt;**](TransitionResponse.md) |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { JourneyDefinitionResponse } from './api';

const instance: JourneyDefinitionResponse = {
    id,
    journeyCode,
    name,
    version,
    states,
    transitions,
    active,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
