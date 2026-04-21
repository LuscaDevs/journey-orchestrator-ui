# JourneyInstancesApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createJourneyInstance**](#createjourneyinstance) | **POST** /journey-instances | Start a new journey instance|
|[**getJourneyInstance**](#getjourneyinstance) | **GET** /journey-instances/{instanceId} | Get journey instance by id|
|[**sendEvent**](#sendevent) | **POST** /journey-instances/{instanceId}/events | Send event to a journey instance|

# **createJourneyInstance**
> JourneyInstanceResponse createJourneyInstance(createJourneyInstanceRequest)


### Example

```typescript
import {
    JourneyInstancesApi,
    Configuration,
    CreateJourneyInstanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyInstancesApi(configuration);

let createJourneyInstanceRequest: CreateJourneyInstanceRequest; //

const { status, data } = await apiInstance.createJourneyInstance(
    createJourneyInstanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createJourneyInstanceRequest** | **CreateJourneyInstanceRequest**|  | |


### Return type

**JourneyInstanceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Journey instance created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getJourneyInstance**
> JourneyInstanceResponse getJourneyInstance()


### Example

```typescript
import {
    JourneyInstancesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyInstancesApi(configuration);

let instanceId: string; // (default to undefined)

const { status, data } = await apiInstance.getJourneyInstance(
    instanceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instanceId** | [**string**] |  | defaults to undefined|


### Return type

**JourneyInstanceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Journey instance found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendEvent**
> JourneyInstanceResponse sendEvent(eventRequest)


### Example

```typescript
import {
    JourneyInstancesApi,
    Configuration,
    EventRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyInstancesApi(configuration);

let instanceId: string; // (default to undefined)
let eventRequest: EventRequest; //

const { status, data } = await apiInstance.sendEvent(
    instanceId,
    eventRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventRequest** | **EventRequest**|  | |
| **instanceId** | [**string**] |  | defaults to undefined|


### Return type

**JourneyInstanceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event processed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

