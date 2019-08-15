{{description}}

## Requests

Any tool that is fluent in HTTP can communicate with the API simply by requesting the correct URI. Requests should be made using the **HTTPS** protocol so that traffic is encrypted. The interface responds to different methods depending on the action required.

| **Method** | **Usage** |
|------------|-----------|
|**GET**|For simple retrieval of information about your account, contracts or any other resource, you should use the **GET** method. The information you request will be returned to you as a JSON object.<br><br>The attributes defined by the JSON object can be used to form additional requests. Any request using the GET method is read-only and will not affect any of the objects you are querying.|
|**DELETE**|To destroy a resource and remove it from your account, the **DELETE** method should be used. This will remove the specified object if it is found. If it is not found, the operation will return a response indicating that the object was not found.<br><br>This [idempotency](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning) means that you do not have to check for a resource's availability prior to issuing a delete command, the final state will be the same regardless of its existence.|
|**PUT**|To update the information about a resource in your account, the **PUT** method is available.<br><br>Like the DELETE Method, the PUT method is idempotent. It sets the state of the target using the provided values, regardless of their current values. Requests using the PUT method do not need to check the current attributes of the object.|
|**POST**|To create a new object, your request should specify the **POST** method.<br><br>The POST request includes all of the attributes necessary to create a new object. When you wish to create a new object, send a POST request to the target endpoint.|
|**HEAD**|Finally, to retrieve metadata information, you should use the **HEAD** method to get the headers. This returns only the header of what would be returned with an associated GET request.<br><br>Response headers contain some useful information about your API access and the results that are available for your request.|


## HTTP Statuses


Along with the HTTP methods that the API responds to, it will also return standard HTTP statuses, including error codes.

In the event of a problem, the status will contain the error code, while the body of the response will usually contain additional information about the problem that was encountered.

In general, if the status returned is in the 200 range, it indicates that the request was fulfilled successfully and that no error was encountered.

Return codes in the 400 range typically indicate that there was an issue with the request that was sent. Among other things, this could mean that you did not authenticate correctly, that you are requesting an action that you do not have authorization for, that the object you are requesting does not exist, or that your request is malformed.

If you receive a status in the 500 range, this generally indicates a server-side problem. This means that we are having an issue on our end and cannot fulfill your request currently.


## Responses


When a request is successful, a response body will typically be sent back in the form of a JSON object. An exception to this is when a DELETE request is processed, which will result in a successful HTTP 204 status and an empty response body.

This JSON object, will contains the details of the entity if the request operated on a single object, and a pagination envelop if a collection was processed.

For example, if you send a GET request to `/api/v1/contracts/:contractID` you will get back the object of the contract. However, if you send the GET request to the general collection at `/api/v1/contracts`, you will get back an object with is form:

```json
{
	"value": [],
	"count": 100,
	"top": 10,
	"skip": 0
}
```


## Error message

In case of errored response, the body will contains the details of the error:

_Example_:

```json 
{
	"code": 413,
	"message": "The request body is malformed",
	"errors": [{
		"code": "41301",
		"message": "Mondatory field: <strong>name</strong>"
	}]
}
```


* **`code`**: The error code. Used for debugging purposes.
* **`message`**: Contains the main message to display to the user.
* [Optional] **`errors`**: An array of error objects. Contains the details of occured errors.
