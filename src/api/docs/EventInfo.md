
# EventInfo


## Properties

Name | Type
------------ | -------------
`type` | string
`data` | { [key: string]: any; }

## Example

```typescript
import type { EventInfo } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "data": null,
} satisfies EventInfo

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EventInfo
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


