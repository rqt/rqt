# rqt

[![npm version](https://badge.fury.io/js/rqt.svg)](https://badge.fury.io/js/rqt)

`rqt` is a Node.js request library. Send `GET` and `POST` requests at ease.

## `async rqt(url: string, options: Options = {}): string`

Call this function to request a web page.

```js
const rqt = require('rqt')

(async () => {
  const res = await rqt('http://rqt.adc.sh/')
  // web page contents returned
})()
```

It is possible to pass some options as the second argument.

```js
const rqt = require('rqt')

(async () => {
  const bufferRes = await rqt('http://rqt.adc.sh/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Node.js) rqt',
    },
    binary: true,
  })
})()
```

### `headers: object`

An object to be assigned as request headers.

### `binary: boolean`

If set to true, a Buffer will be returned instead of a string.

## `async rqt(url: string, { data: string, contentType: string }): string`

Send a post request (with default `JSON` content type and calculated
`Content-Length`). Assign more headers with `headers` option.

```js
const rqt = require('rqt')

(async () => {
  const res = await rqt('http://rqt.adc.sh/post/', {
    data: JSON.stringify({ data: 'test-post-data' }),
    contentType: 'application/json', // default is assumed json
  })
})()
```

```js
const rqt = require('rqt')

(async () => {
  const res = await rqt('http://rqt.adc.sh/post/headers', {
    data: 'test post data',
    contentType: 'application/x-www-form-urlencoded', // non-json request
    headers: {
      'x-token': 'token123',
    },
  })
})()
```

## ES5

The package uses some newer language features. For your convenience, it's been
transpiled to be compatible with Node 4. You can use the following snippet.

```js
const rqt = require('rqt/es5')
```

---

(c) [Art Deco Code](https://artdeco.bz) 2018
