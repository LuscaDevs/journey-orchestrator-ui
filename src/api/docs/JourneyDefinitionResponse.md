
# JourneyDefinitionResponse


## Properties

Name | Type
------------ | -------------
`id` | string
`journeyCode` | string
`name` | string
`version` | number
`states` | [Array&lt;State&gt;](State.md)
`transitions` | [Array&lt;TransitionResponse&gt;](TransitionResponse.md)
`active` | boolean
`createdAt` | Date

## Example

```typescript
import type { JourneyDefinitionResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "journeyCode": null,
  "name": null,
  "version": null,
  "states": null,
  "transitions": null,
  "active": null,
  "createdAt": null,
} satisfies JourneyDefinitionResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JourneyDefinitionResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


