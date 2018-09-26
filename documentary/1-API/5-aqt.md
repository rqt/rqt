```## async aqt => AqtReturn
[
  ["url", "string"],
  ["options?", "AqtOptions"]
]
```

Request a web page and return additional information about the request. This method is also available as a standalone package: [`@rqt/aqt`](https://github.com/rqt/aqt).

%TYPEDEF node_modules/@rqt/aqt/types/index.xml%

%TYPEDEF node_modules/@rqt/aqt/types/return.xml%

<!-- ```## async sqt => Readable
[
  ["url", "string"],
  ["options?", "Options"]
]
```

Request a web page as a stream. -->
<!--
```table
[
  ["Option", "Type", "Description"],
  ["`headers`", "object", "An object to be assigned as request headers."],
  ["`binary`", "boolean", "If set to true, a `Buffer` will be returned instead of a string."],
  ["`returnHeaders`", "boolean", "Return an object with `body` and `headers` properties instead of just the response."]
]
```

```### async rqtWithData => string
[
  ["url", "string"],
  ["options", {
    "data": ["string|object"],
    "type?": ["string", "json"],
    "method?": ["string", "POST"]
  }]
]
``` -->

<!-- Send a request with data. The default type is `json` into which data will be serialised. `form` type is also supported for sending form data. All options from the blank request are also supported. -->

<!-- ```js
import rqt from 'rqt'

(async () => {
  const res = await rqt('http://rqt.adc.sh/post', {
    data: {
      login: 'user',
      password: 123456,
    }
    type: 'form',
    method: 'PUT',
    headers: {
      'x-token': 'token123',
    },
  })
})()
``` -->

<!-- ```table
[
  ["Option", "Type", "Description"],
  ["`data`", "string|object", "Raw data or an object with data to send."],
  ["`type`", "string", "How to encode data. The following are supported: set `form` for `application/x-www-form-urlencoded` and `json` for `application/json`."],
  ["`method`", "string", "An HTTP method to use for sending data."],
  ["`...`", "", "All other options from the request function."]
]
``` -->

%~%