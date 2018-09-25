# rqt

[![npm version](https://badge.fury.io/js/rqt.svg)](https://npmjs.org/package/rqt)

`rqt` is a Node.js request library. Send `GET` and `POST` requests at ease.

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`Options` Type](#options-type)
- [`async rqt(url: string, options?: Options): string`](#async-rqturl-stringoptions-options-string)
- [`async bqt(url: string, options?: Options): Buffer`](#async-bqturl-stringoptions-options-buffer)
- [`async sqt(url: string, options?: Options): Readable`](#async-sqturl-stringoptions-options-readable)
- [`Session` Class](#session-class)
    * [`constructor(headers?: object): Session`](#constructorheaders-object-session)
    * [`async request(location: string, options?: Options): any`](#async-requestlocation-stringoptions-options-any)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package can be used from Node.js as multiple functions for different kinds of requests to make. The main purpose of splitting the package into multiple functions is to be able to get the correct type inference, e.g., a string for `rqt`, buffer for `bqt` and an object for `jqt`.

```js
import rqt, { jqt, bqt, sqt, aqt, Session } from 'rqt'
```

|                      Function                       |     Meaning      |                            Return type                             |
| --------------------------------------------------- | ---------------- | ------------------------------------------------------------------ |
| [`rqt`](#async-rqturl-stringoptions-options-string) | String Request   | Request a web page and return the result as a string.              |
| `jqt`              | JSON Request     | Parse result as a `JSON` object.   |
| [`bqt`](#async-bqturl-stringoptions-options-string) | Binary Request   | Result will be returned as a buffer.                               |
| `sqt`             | Stream Request   | Result is returned as a stream.                                    |
| `aqt`             | Advanced Request | Result will contain headers and status code, alias for `@rqt/aqt`. |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `Options` Type

`rqt`, `jqt`, `bqt` and `sqt` accept options to set headers and send data as the second argument after the URL.

`import('http').OutgoingHttpHeaders` __<a name="type-outgoinghttpheaders">`OutgoingHttpHeaders`</a>__

__<a name="type-options">`Options`</a>__: Options for requests.

|   Name   |                        Type                        |                                                           Description                                                           | Default  |
| -------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| data     | _*_                                                | Optional data to send to the server with the request.                                                                           | -        |
| type     | _'form'\|'json'_                                   | How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default.            | `'json'` |
| headers  | _[OutgoingHttpHeaders](#type-outgoinghttpheaders)_ | Headers to use for the request.                                                                                                 | -        |
| compress | _boolean_                                          | Add the `Accept-Encoding: gzip, deflate` header automatically to indicate to the server that it can send a compressed response. | `true`   |
| method   | _string_                                           | What HTTP method to use to send data.                                                                                           | `POST`   |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `async rqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): string`

Request a web page, and return the result as a string.

```js
import rqt from 'rqt'

const Request = async (url) => {
  const res = await rqt(url)
  console.log(res)
}
```
```
Hello World
```

To send data to the server, add some [options](#options-type).

```js
import rqt from 'rqt'

const Request = async (url) => {
  const res = await rqt(url, {
    headers: {
      'User-Agent': '@rqt/rqt (Node.js)',
    },
    data: {
      username: 'new-user',
      password: 'pass123',
    },
    type: 'form',
    method: 'PUT',
  })
  console.log(res)
}
```
```json5
{
  "res": "You have requested:",
  "body": {
    "username": "new-user",
    "password": "pass123"
  },
  "method": "PUT",
  "headers": {
    "user-agent": "@rqt/rqt (Node.js)",
    "content-type": "application/x-www-form-urlencoded",
    "content-length": "34",
    "accept-encoding": "gzip, deflate",
    "host": "localhost:5001",
    "connection": "close"
  }
}
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## `async bqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Buffer`

Request a web page, and return the result as a buffer.

```js
import { bqt } from 'rqt'

const Request = async (url) => {
  const res = await bqt(url)
  console.log(res)
}
```
```
<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## `async sqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Readable`

Request a web page as a stream.
<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## `Session` Class

The _Session_ class allows to remember cookies set during all requests. It will maintain an internal state and update cookies when necessary.

#### `constructor(`<br/>&nbsp;&nbsp;`headers?: object,`<br/>`): Session`

Create an instance of a `Session` class. All headers specified here will be present for each request (unless overridden by the `request` method).

#### `async request(`<br/>&nbsp;&nbsp;`location: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): any`

Request a page. All options are the same as accepted by the `rqt` functions.

```js
import { Session } from 'rqt'

const USER_AGENT = 'Mozilla/5.0 Node.js rqt'

;(async () => {
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
})()
```

## Copyright

(c) [Art Deco](https://artdeco.bz) 2018

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>