
# CreateJourneyDefinitionRequest


## Properties

Name | Type
------------ | -------------
`journeyCode` | string
`name` | string
`version` | number
`states` | [Array&lt;State&gt;](State.md)
`transitions` | [Array&lt;TransitionRequest&gt;](TransitionRequest.md)

## Example

```typescript
import type { CreateJourneyDefinitionRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "journeyCode": null,
  "name": null,
  "version": null,
  "states": null,
  "transitions": null,
} satisfies CreateJourneyDefinitionRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateJourneyDefinitionRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


