# JourneyDefinitionsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createJourneyDefinition**](#createjourneydefinition) | **POST** /journeys | Create a new journey definition|
|[**deleteJourneyDefinition**](#deletejourneydefinition) | **DELETE** /journeys/{id} | Delete a journey definition by ID|
|[**getJourneyDefinitionsByCode**](#getjourneydefinitionsbycode) | **GET** /journeys/{journeyCode} | Get all versions of a journey definition|
|[**listJourneyDefinitions**](#listjourneydefinitions) | **GET** /journeys | List all journey definitions|

# **createJourneyDefinition**
> JourneyDefinitionResponse createJourneyDefinition(createJourneyDefinitionRequest)


### Example

```typescript
import {
    JourneyDefinitionsApi,
    Configuration,
    CreateJourneyDefinitionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyDefinitionsApi(configuration);

let createJourneyDefinitionRequest: CreateJourneyDefinitionRequest; //

const { status, data } = await apiInstance.createJourneyDefinition(
    createJourneyDefinitionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createJourneyDefinitionRequest** | **CreateJourneyDefinitionRequest**|  | |


### Return type

**JourneyDefinitionResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Journey definition created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteJourneyDefinition**
> deleteJourneyDefinition()


### Example

```typescript
import {
    JourneyDefinitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyDefinitionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteJourneyDefinition(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Journey definition deleted |  -  |
|**404** | Journey definition not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getJourneyDefinitionsByCode**
> Array<JourneyDefinitionResponse> getJourneyDefinitionsByCode()


### Example

```typescript
import {
    JourneyDefinitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyDefinitionsApi(configuration);

let journeyCode: string; // (default to undefined)

const { status, data } = await apiInstance.getJourneyDefinitionsByCode(
    journeyCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **journeyCode** | [**string**] |  | defaults to undefined|


### Return type

**Array<JourneyDefinitionResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Journey definitions found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listJourneyDefinitions**
> Array<JourneyDefinitionResponse> listJourneyDefinitions()


### Example

```typescript
import {
    JourneyDefinitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JourneyDefinitionsApi(configuration);

const { status, data } = await apiInstance.listJourneyDefinitions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<JourneyDefinitionResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of journey definitions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

