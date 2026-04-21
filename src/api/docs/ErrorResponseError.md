# ErrorResponseError


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | Error code | [default to undefined]
**message** | **string** | Human-readable error message | [default to undefined]
**details** | **{ [key: string]: any; }** | Additional error details | [optional] [default to undefined]

## Example

```typescript
import { ErrorResponseError } from './api';

const instance: ErrorResponseError = {
    code,
    message,
    details,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
