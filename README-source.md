# rqt

%NPM: rqt%

`rqt` is a Node.js request library. Send `GET` and `POST` requests at ease.

## Table Of Contents

%TOC%

## API

The package can be used from Node.js.

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

```### Session
```

The `Session` class allows to remember the cookies during subsequent requests. It will maintain an internal state and update cookies when necessary.


```#### constructor => Session
[
  ["headers", "object"]
]
```

Create an instance of a `Session` class. All headers specified here will be present for each request (unless overridden by the `request` method).

```#### async request => any
[
  ["location", "string"],
  ["options", "object"]
]
```

Request a page. All options are the same as accepted by the `rqt` functions.

```js
const session = new Session({
  headers: {
    'User-Agent': USER_AGENT,
  },
})
const { SessionKey } = await session.request('http://127.0.0.1/Session.ashx')

const { body, headers } = await session.request('http://127.0.0.1/Login.aspx', {
  data: {
    LoginUserName: 'test',
    LoginPassword: 'test',
    sessionEncryptValue: SessionKey,
  },
  type: 'form',
  returnHeaders: true,
})
```

---

(c) [Art Deco Code](https://artdeco.bz) 2018
