
# CreateJourneyInstanceRequest


## Properties

Name | Type
------------ | -------------
`journeyCode` | string
`version` | number
`context` | { [key: string]: any; }

## Example

```typescript
import type { CreateJourneyInstanceRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "journeyCode": null,
  "version": null,
  "context": null,
} satisfies CreateJourneyInstanceRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateJourneyInstanceRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


