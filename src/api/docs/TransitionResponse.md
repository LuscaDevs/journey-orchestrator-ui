
# TransitionResponse


## Properties

Name | Type
------------ | -------------
`source` | string
`event` | string
`target` | string
`condition` | string

## Example

```typescript
import type { TransitionResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "source": null,
  "event": null,
  "target": null,
  "condition": #eventData.amount > 1000 AND #eventData.priority == 'HIGH',
} satisfies TransitionResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TransitionResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


