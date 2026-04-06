# JourneyDefinitionsApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createJourneyDefinition**](JourneyDefinitionsApi.md#createjourneydefinitionoperation) | **POST** /journeys | Create a new journey definition |
| [**getJourneyDefinitionsByCode**](JourneyDefinitionsApi.md#getjourneydefinitionsbycode) | **GET** /journeys/{journeyCode} | Get all versions of a journey definition |
| [**listJourneyDefinitions**](JourneyDefinitionsApi.md#listjourneydefinitions) | **GET** /journeys | List all journey definitions |



## createJourneyDefinition

> JourneyDefinitionResponse createJourneyDefinition(createJourneyDefinitionRequest)

Create a new journey definition

### Example

```ts
import {
  Configuration,
  JourneyDefinitionsApi,
} from '';
import type { CreateJourneyDefinitionOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyDefinitionsApi();

  const body = {
    // CreateJourneyDefinitionRequest
    createJourneyDefinitionRequest: ...,
  } satisfies CreateJourneyDefinitionOperationRequest;

  try {
    const data = await api.createJourneyDefinition(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createJourneyDefinitionRequest** | [CreateJourneyDefinitionRequest](CreateJourneyDefinitionRequest.md) |  | |

### Return type

[**JourneyDefinitionResponse**](JourneyDefinitionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Journey definition created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getJourneyDefinitionsByCode

> Array&lt;JourneyDefinitionResponse&gt; getJourneyDefinitionsByCode(journeyCode)

Get all versions of a journey definition

### Example

```ts
import {
  Configuration,
  JourneyDefinitionsApi,
} from '';
import type { GetJourneyDefinitionsByCodeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyDefinitionsApi();

  const body = {
    // string
    journeyCode: journeyCode_example,
  } satisfies GetJourneyDefinitionsByCodeRequest;

  try {
    const data = await api.getJourneyDefinitionsByCode(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **journeyCode** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;JourneyDefinitionResponse&gt;**](JourneyDefinitionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Journey definitions found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listJourneyDefinitions

> Array&lt;JourneyDefinitionResponse&gt; listJourneyDefinitions()

List all journey definitions

### Example

```ts
import {
  Configuration,
  JourneyDefinitionsApi,
} from '';
import type { ListJourneyDefinitionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyDefinitionsApi();

  try {
    const data = await api.listJourneyDefinitions();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;JourneyDefinitionResponse&gt;**](JourneyDefinitionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of journey definitions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

