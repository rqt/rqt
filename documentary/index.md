# rqt

%NPM: rqt%

`rqt` is a Node.js request library. Send `GET` and `POST` requests at ease.

## Table Of Contents

%TOC%

## API

The package can be used from Node.js. There are multiple functions for different kinds of operations to perform. The main purpose of splitting the package into multiple functions is to be able to get the correct type inference.

```js
import rqt, { jqt, bqt, sqt, aqt } from 'rqt'
```

```table
[
  ["Function", "Meaning", "Return type"],
  ["`rqt`", "String Request", "Request a web page and return the result as a string."],
  ["`jqt`", "JSON Request", "Parse result as a `JSON` object."],
  ["`bqt`", "Binary Request", "Result will be returned as a buffer."],
  ["`sqt`", "Stream Request", "Result is returned as a stream."],
  ["`aqt`", "Advanced Request", "Result will contain headers and status code, alias for `@rqt/aqt`."]
]
```

### `Options` Type

`rqt`, `jqt`, `bqt` and `sqt` accept options to set headers and send data as the second argument after the URL.

%TYPE true
<p name="data" type="object">
  <d>Optional data to send to the server with the request.</d>
  <e>

```
{
  user: 'test',
  password: 'Swordfish',
}
```
</e>
</p>
<p name="type" type="'form'|'json'">
  <d>How to send data: <code>json</code> to serialise JSON data and <code>form</code> for url-encoded transmission with <code>json</code> mode by default.</d>
  <e><code>form</code></e>
</p>
<p name="headers" type="object">
  <d>Headers to send along with the request.</d>
  <e>

```
{
  'User-Agent': 'Node.js rqt',
}
```
</e>
</p>
<p name="method" type="string">
  <d>What HTTP method to use to send data (only works when <code>data</code> is set). Defaults to <code>POST</code>.</d>
  <e><code>PUT</code></e>
</p>
%

```### async rqt => string
[
  ["url", "string"],
  ["options?", "Options"]
]
```

Call this function to request a web page, which will be returned as a string.

%EXAMPLE: example/rqt.js, ../src => rqt, javascript%

%FORK example example/rqt.js%

To send data to the server, add options.

%EXAMPLE: example/rqt-options.js, ../src => rqt, javascript%

```### async sqt => Readable
[
  ["url", "string"],
  ["options?", "Options"]
]
```

Request a web page as a stream.
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

### `Session` Class

The `Session` class allows to remember cookies set during all requests. It will maintain an internal state and update cookies when necessary.


```#### constructor => Session
[
  ["headers?", "object"]
]
```

Create an instance of a `Session` class. All headers specified here will be present for each request (unless overridden by the `request` method).

```#### async request => any
[
  ["location", "string"],
  ["options?", "Options"]
]
```

Request a page. All options are the same as accepted by the `rqt` functions.

%EXAMPLE: example/session.js, ../src => rqt, javascript%
