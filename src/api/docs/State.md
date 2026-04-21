# State


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the state (UUID v4). Auto-generated if not provided. | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**type** | [**StateType**](StateType.md) |  | [default to undefined]
**position** | [**StatePosition**](StatePosition.md) |  | [optional] [default to undefined]

## Example

```typescript
import { State } from './api';

const instance: State = {
    id,
    name,
    type,
    position,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
