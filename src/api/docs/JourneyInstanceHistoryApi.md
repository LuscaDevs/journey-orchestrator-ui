# JourneyInstanceHistoryApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getJourneyInstanceHistory**](JourneyInstanceHistoryApi.md#getjourneyinstancehistory) | **GET** /journey-instances/{instanceId}/history | Get transition history for a journey instance |



## getJourneyInstanceHistory

> TransitionHistoryListResponse getJourneyInstanceHistory(instanceId, from, to, eventType, limit, offset)

Get transition history for a journey instance

Retrieves the complete transition history for a specific journey instance in chronological order

### Example

```ts
import {
  Configuration,
  JourneyInstanceHistoryApi,
} from '';
import type { GetJourneyInstanceHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new JourneyInstanceHistoryApi();

  const body = {
    // string | ID of the journey instance
    instanceId: instanceId_example,
    // Date | Filter history from this timestamp (ISO 8601) (optional)
    from: 2013-10-20T19:20:30+01:00,
    // Date | Filter history to this timestamp (ISO 8601) (optional)
    to: 2013-10-20T19:20:30+01:00,
    // string | Filter by specific event type (optional)
    eventType: eventType_example,
    // number | Maximum number of events to return (optional)
    limit: 56,
    // number | Number of events to skip (for pagination) (optional)
    offset: 56,
  } satisfies GetJourneyInstanceHistoryRequest;

  try {
    const data = await api.getJourneyInstanceHistory(body);
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
| **instanceId** | `string` | ID of the journey instance | [Defaults to `undefined`] |
| **from** | `Date` | Filter history from this timestamp (ISO 8601) | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | Filter history to this timestamp (ISO 8601) | [Optional] [Defaults to `undefined`] |
| **eventType** | `string` | Filter by specific event type | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of events to return | [Optional] [Defaults to `100`] |
| **offset** | `number` | Number of events to skip (for pagination) | [Optional] [Defaults to `0`] |

### Return type

[**TransitionHistoryListResponse**](TransitionHistoryListResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transition history retrieved successfully |  -  |
| **404** | Journey instance not found |  -  |
| **400** | Invalid request parameters |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

