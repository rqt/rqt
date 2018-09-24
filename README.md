# rqt

[![npm version](https://badge.fury.io/js/rqt.svg)](https://npmjs.org/package/rqt)

`rqt` is a Node.js request library. Send `GET` and `POST` requests at ease.

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`Options` Type](#options-type)
  * [<code>data</code>](#data)
  * [<code>type</code>](#type)
  * [<code>headers</code>](#headers)
  * [<code>method</code>](#method)
- [`async rqt(url: string, options?: Options): string`](#async-rqturl-stringoptions-options-string)
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

| Function |     Meaning      |                            Return type                             |
| -------- | ---------------- | ------------------------------------------------------------------ |
| `rqt` | String Request   | Request a web page and return the result as a string.              |
| `jqt` | JSON Request     | Parse result as a `JSON` object.   |
| `bqt` | Binary Request   | Result will be returned as a buffer.                               |
| `sqt` | Stream Request   | Result is returned as a stream.                                    |
| `aqt` | Advanced Request | Result will contain headers and status code, alias for `@rqt/aqt`. |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `Options` Type

`rqt`, `jqt`, `bqt` and `sqt` accept options to set headers and send data as the second argument after the URL.

<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
   <th>Example</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><a name="data"><code>data</code></a></td>
   <td><em>object</em></td>
   <td>Optional data to send to the server with the request.</td>
   <td>

```
{
  user: 'test',
  password: 'Swordfish',
}
```
</td>
  </tr>
  <tr>
   <td><a name="type"><code>type</code></a></td>
   <td><em>'form'|'json'</em></td>
   <td>How to send data: <code>json</code> to serialise JSON data and <code>form</code> for url-encoded transmission with <code>json</code> mode by default.</td>
   <td><code>form</code></td>
  </tr>
  <tr>
   <td><a name="headers"><code>headers</code></a></td>
   <td><em>object</em></td>
   <td>Headers to send along with the request.</td>
   <td>

```
{
  'User-Agent': 'Node.js rqt',
}
```
</td>
  </tr>
  <tr>
   <td><a name="method"><code>method</code></a></td>
   <td><em>string</em></td>
   <td>What HTTP method to use to send data (only works when <code>data</code> is set). Defaults to <code>POST</code>.</td>
   <td><code>PUT</code></td>
  </tr>
 </tbody>
</table>


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `async rqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): string`

Call this function to request a web page, which will be returned as a string.

```js
import { HTTPContext } from 'https-context'
import rqt from 'rqt'

(async () => {
  let c
  try {
    c = new HTTPContext()
    await c._init()
    c.setResponse('Hello World')
    const res = await rqt(c.url)
    console.log(res)
  } finally {
    await c._destroy()
  }
})()
```
```

```

To send data to the server, add options.

```js
import rqt from 'rqt'

(async () => {
  const { body, headers } = await rqt('http://rqt.adc.sh/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Node.js) rqt',
    },
    binary: true,
    returnHeaders: false,
  })
})()
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## `async sqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Readable`

Request a web page as a stream.
<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

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