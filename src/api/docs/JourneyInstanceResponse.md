
# JourneyInstanceResponse


## Properties

Name | Type
------------ | -------------
`instanceId` | string
`journeyCode` | string
`version` | number
`currentState` | string
`status` | [JourneyStatus](JourneyStatus.md)
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { JourneyInstanceResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "instanceId": null,
  "journeyCode": null,
  "version": null,
  "currentState": null,
  "status": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies JourneyInstanceResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JourneyInstanceResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


