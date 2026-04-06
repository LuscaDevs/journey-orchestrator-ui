# JourneyInstancesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createJourneyInstance**](JourneyInstancesApi.md#createjourneyinstanceoperation) | **POST** /journey-instances | Start a new journey instance |
| [**getJourneyInstance**](JourneyInstancesApi.md#getjourneyinstance) | **GET** /journey-instances/{instanceId} | Get journey instance by id |
| [**sendEvent**](JourneyInstancesApi.md#sendevent) | **POST** /journey-instances/{instanceId}/events | Send event to a journey instance |



## createJourneyInstance

> JourneyInstanceResponse createJourneyInstance(createJourneyInstanceRequest)

Start a new journey instance

### Example

```ts
import {
  Configuration,
  JourneyInstancesApi,
} from '';
import type { CreateJourneyInstanceOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyInstancesApi();

  const body = {
    // CreateJourneyInstanceRequest
    createJourneyInstanceRequest: ...,
  } satisfies CreateJourneyInstanceOperationRequest;

  try {
    const data = await api.createJourneyInstance(body);
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
| **createJourneyInstanceRequest** | [CreateJourneyInstanceRequest](CreateJourneyInstanceRequest.md) |  | |

### Return type

[**JourneyInstanceResponse**](JourneyInstanceResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Journey instance created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getJourneyInstance

> JourneyInstanceResponse getJourneyInstance(instanceId)

Get journey instance by id

### Example

```ts
import {
  Configuration,
  JourneyInstancesApi,
} from '';
import type { GetJourneyInstanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyInstancesApi();

  const body = {
    // string
    instanceId: instanceId_example,
  } satisfies GetJourneyInstanceRequest;

  try {
    const data = await api.getJourneyInstance(body);
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
| **instanceId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**JourneyInstanceResponse**](JourneyInstanceResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Journey instance found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sendEvent

> JourneyInstanceResponse sendEvent(instanceId, eventRequest)

Send event to a journey instance

### Example

```ts
import {
  Configuration,
  JourneyInstancesApi,
} from '';
import type { SendEventRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyInstancesApi();

  const body = {
    // string
    instanceId: instanceId_example,
    // EventRequest
    eventRequest: ...,
  } satisfies SendEventRequest;

  try {
    const data = await api.sendEvent(body);
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
| **instanceId** | `string` |  | [Defaults to `undefined`] |
| **eventRequest** | [EventRequest](EventRequest.md) |  | |

### Return type

[**JourneyInstanceResponse**](JourneyInstanceResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Event processed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

