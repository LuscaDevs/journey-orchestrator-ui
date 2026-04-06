
# TransitionHistoryListResponse


## Properties

Name | Type
------------ | -------------
`instanceId` | string
`events` | [Array&lt;TransitionHistoryEventResponse&gt;](TransitionHistoryEventResponse.md)
`pagination` | [PaginationInfo](PaginationInfo.md)
`totalCount` | number

## Example

```typescript
import type { TransitionHistoryListResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "instanceId": null,
  "events": null,
  "pagination": null,
  "totalCount": null,
} satisfies TransitionHistoryListResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TransitionHistoryListResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


