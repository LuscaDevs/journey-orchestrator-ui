
# TransitionHistoryEventResponse


## Properties

Name | Type
------------ | -------------
`id` | string
`instanceId` | string
`fromState` | string
`toState` | string
`event` | [EventInfo](EventInfo.md)
`timestamp` | Date
`metadata` | { [key: string]: any; }
`sequenceNumber` | number

## Example

```typescript
import type { TransitionHistoryEventResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "instanceId": null,
  "fromState": null,
  "toState": null,
  "event": null,
  "timestamp": null,
  "metadata": null,
  "sequenceNumber": null,
} satisfies TransitionHistoryEventResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TransitionHistoryEventResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


