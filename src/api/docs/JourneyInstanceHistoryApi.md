# JourneyInstanceHistoryApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getJourneyInstanceHistory**](#getjourneyinstancehistory) | **GET** /journey-instances/{instanceId}/history | Get transition history for a journey instance|

# **getJourneyInstanceHistory**
> TransitionHistoryListResponse getJourneyInstanceHistory()

Retrieves the complete transition history for a specific journey instance in chronological order

### Example

```typescript
import {
    JourneyInstanceHistoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyInstanceHistoryApi(configuration);

let instanceId: string; //ID of the journey instance (default to undefined)
let from: string; //Filter history from this timestamp (ISO 8601) (optional) (default to undefined)
let to: string; //Filter history to this timestamp (ISO 8601) (optional) (default to undefined)
let eventType: string; //Filter by specific event type (optional) (default to undefined)
let limit: number; //Maximum number of events to return (optional) (default to 100)
let offset: number; //Number of events to skip (for pagination) (optional) (default to 0)

const { status, data } = await apiInstance.getJourneyInstanceHistory(
    instanceId,
    from,
    to,
    eventType,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instanceId** | [**string**] | ID of the journey instance | defaults to undefined|
| **from** | [**string**] | Filter history from this timestamp (ISO 8601) | (optional) defaults to undefined|
| **to** | [**string**] | Filter history to this timestamp (ISO 8601) | (optional) defaults to undefined|
| **eventType** | [**string**] | Filter by specific event type | (optional) defaults to undefined|
| **limit** | [**number**] | Maximum number of events to return | (optional) defaults to 100|
| **offset** | [**number**] | Number of events to skip (for pagination) | (optional) defaults to 0|


### Return type

**TransitionHistoryListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Transition history retrieved successfully |  -  |
|**404** | Journey instance not found |  -  |
|**400** | Invalid request parameters |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

