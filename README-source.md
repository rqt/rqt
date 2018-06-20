# rqt

%NPM: rqt%

`rqt` is a Node.js request library. Send `GET` and `POST` requests at ease.

## Table Of Contents

%TOC%

```### async rqt => string
[
  ["url", "string"],
  ["options", {
    "headers": "object",
    "binary": "boolean"
  }]
]
```

Call this function to request a web page.

```js
import rqt from 'rqt'

(async () => {
  const res = await rqt('http://rqt.adc.sh/')
  // web page contents returned
})()
```

It is possible to pass some options as the second argument.

```js
import rqt from 'rqt'

(async () => {
  const bufferRes = await rqt('http://rqt.adc.sh/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Node.js) rqt',
    },
    binary: true,
    returnHeaders: false,
  })
})()
```

```table
[
  ["Option", "Type", "Description"],
  ["`headers`", "object", "An object to be assigned as request headers."],
  ["`binary`", "boolean", "If set to true, a `Buffer` will be returned instead of a string."]
  ["`returnHeaders`", "boolean", "Return an object with `body` and `headers` properties instead of just the response."]
]
```

```### async rqtWithData => string
[
  ["url", "string"],
  ["options", {
    "data": "string",
    "type": "json|form",
    "method": "POST"
  }]
]
```

Send a request with data. The default type is `json` into which data will be serialised. `form` type is also supported for sending form data. All options from the blank request are also supported.

```js
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
```

```table
[
  ["Option", "Type", "Description"],
  ["`data`", "string|object", "Raw data or an object with data to send."],
  ["`type`", "form|json", "How to encode data. The following are supported: set `form` for `application/x-www-form-urlencoded` and `json` for `application/json`."],
  ["`method`", "string", "An HTTP method to use for sending data."],
  ["`...`", "", "All other options from the request function."]
]
```

---

(c) [Art Deco Code](https://artdeco.bz) 2018
