# CreateJourneyDefinitionRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**journeyCode** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**version** | **number** |  | [default to undefined]
**states** | [**Array&lt;State&gt;**](State.md) |  | [default to undefined]
**transitions** | [**Array&lt;TransitionRequest&gt;**](TransitionRequest.md) |  | [default to undefined]

## Example

```typescript
import { CreateJourneyDefinitionRequest } from './api';

const instance: CreateJourneyDefinitionRequest = {
    journeyCode,
    name,
    version,
    states,
    transitions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
