# rqt

[![npm version](https://badge.fury.io/js/rqt.svg)](https://npmjs.org/package/rqt)

`rqt` is a Node.js request library. It allows to send requests with or without data, parse a JSON response automatically and enables `gzip` compression by default.

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`AqtOptions`](#type-aqtoptions)
- [`async rqt(url: string, options?: Options): string`](#async-rqturl-stringoptions-options-string)
- [`async jqt(url: string, options?: Options): Object`](#async-jqturl-stringoptions-options-object)
- [`async bqt(url: string, options?: Options): !Buffer`](#async-bqturl-stringoptions-options-buffer)
- [`async aqt(url: string, options?: AqtOptions): AqtReturn`](#async-aqturl-stringoptions-aqtoptions-aqtreturn)
  * [`AqtReturn`](#type-aqtreturn)
- [`Session` Class](#session-class)
    * [`constructor(options?: SessionOptions): Session`](#constructoroptions-sessionoptions-session)
      * [`SessionOptions`](#type-sessionoptions)
    * [`async rqt(location: string, options?: AqtOptions): string`](#async-rqtlocation-stringoptions-aqtoptions-string)
    * [`async jqt(location: string, options?: AqtOptions): Object`](#async-jqtlocation-stringoptions-aqtoptions-object)
    * [`async bqt(location: string, options?: AqtOptions): !Buffer`](#async-bqtlocation-stringoptions-aqtoptions-buffer)
    * [`async aqt(location: string, options?: AqtOptions): !AqtReturn`](#async-aqtlocation-stringoptions-aqtoptions-aqtreturn)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package can be used from Node.js as multiple functions for different kinds of requests to make. The main purpose of splitting the package into multiple functions is to be able to get the correct type inference, e.g., a string for `rqt`, buffer for `bqt` and an object for `jqt`, and make it visually perceivable what kind of data is expected from the server. A _Session_ instance can be used to persist cookies across requests.

```js
import rqt, { jqt, bqt, aqt, Session } from 'rqt'
```

|                         Function                          |       Meaning        |                                          Return type                                          |
| --------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------- |
| [`rqt`](#async-rqturl-stringoptions-options-string) | String Request       | Request a web page and return the result as a string.                                         |
| [`jqt`]((#async-jqturl-stringoptions-options-string)) | JSON Request         | Parse the result as a `JSON` object.                          |
| [`bqt`](#async-bqturl-stringoptions-options-string) | Binary Request       | The result will be returned as a buffer.                                                      |
| [`aqt`](#async-aqturl-stringoptions-aqtoptions-aqtreturn) | Advanced Request     | In addition to the body, the result will contain headers and status, an alias for `@rqt/aqt`. |
| [`Session`](#session-class) | Session With Cookies | Proxies all other methods from this package, but remembers cookies.                           |

  

Each request function accept options to set headers and send data as the second argument after the URL.

__<a name="type-aqtoptions">`AqtOptions`</a>__: Configuration for requests.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
  <th>Default</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">data</td>
  <td><em>!Object</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>Optional data to send to the server with the request.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">type</td>
  <td><em>string</em></td>
  <td rowSpan="3"><code>json</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>How to send data: <code>json</code> to serialise JSON data and add <em>Content-Type: application/json</em> header, and <code>form</code> for url-encoded transmission with <em>Content-Type: application/x-www-form-urlencoded</em>. <em>Multipart/form-data</em> must be implemented manually.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">headers</td>
  <td><em><a href="https://nodejs.org/api/http.html" title="The headers hash map for making requests, including such properties as Content-Encoding, Content-Type, etc.">!http.OutgoingHttpHeaders</a></em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>Headers to use for the request. By default, a single User-Agent header with <em>Mozilla/5.0 (Node.JS) aqt/{version}</em> value is set.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">compress</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>true</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>Add the <code>Accept-Encoding: gzip, deflate</code> header to indicate to the server that it can send a compressed response.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">timeout</td>
  <td><em>number</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>The timeout after which the request should fail.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">method</td>
  <td><em>string</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>What HTTP method to use in making of the request. When no method is given and <code>data</code> is present, defaults to <code>POST</code>.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">binary</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>Whether to return a buffer instead of a string.</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">justHeaders</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>Whether to stop the request after response headers were received, without waiting for the data.</td>
 </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

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

<details>
<summary>Show Server</summary>

```js
import idioCore from '@idio/idio'

const Server = async () => {
  const { url } = await idioCore({
    async hello(ctx) {
      ctx.body = 'Hello World'
    },
  }, { port: 0 })
  return url
}

export default Server
```
</details>

---

To send data to the server, add some [options](#type-aqtoptions).

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
You have requested with PUT:
Body: {
  "username": "new-user",
  "password": "pass123"
}
Headers: {
  "user-agent": "@rqt/rqt (Node.js)",
  "content-type": "application/x-www-form-urlencoded",
  "content-length": "34",
  "accept-encoding": "gzip, deflate",
  "host": "localhost:5001",
  "connection": "close"
}
```

<details>
<summary>Show Server</summary>

```js
import idioCore from '@idio/idio'
import { collect } from 'catchment'
import { parse } from 'querystring'

const Server = async () => {
  const { url } = await idioCore({
    async bodyparser(ctx, next) {
      const data = await collect(ctx.req)
      if (data) ctx.request.body = parse(data)
      await next()
    },
    test(ctx) {
      ctx.body = `You have requested with ${ctx.method}:
Body: ${JSON.stringify(ctx.request.body, null, 2)}
Headers: ${JSON.stringify(ctx.request.headers, null, 2)}
`
    },
  }, { port: 5001 })
  return url
}

export default Server
```
</details>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## `async jqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Object`

Request a web page, and return the result as an object.

```js
import { jqt } from 'rqt'

const Request = async (url) => {
  const res = await jqt(url)
  console.log(JSON.stringify(res, null, 2))
}
```
```
{
  "Hello": "World"
}
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## `async bqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): !Buffer`

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

## `async aqt(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`options?: AqtOptions,`<br/>`): AqtReturn`

Request a web page and return additional information about the request. This method is also available as a standalone package: [`@rqt/aqt`](https://github.com/rqt/aqt).

__<a name="type-aqtreturn">`AqtReturn`</a>__: The return type of the function.


|        Name        |                                                                                              Type                                                                                              |                                                                                                                    Description                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| __body*__          | <em>!(string \| Object \| Buffer)</em>                                                                                                                                                         | The return from the server. In case the `json` content-type was set by the server, the response will be parsed into an object. If `binary` option was used for the request, a `Buffer` will be returned. Otherwise, a string response is returned. |
| __headers*__       | <em><a href="https://nodejs.org/api/http.html" title="The hash map of headers that are set by the server (e.g., when accessed via IncomingMessage.headers)">!http.IncomingHttpHeaders</a></em> | Incoming headers returned by the server.                                                                                                                                                                                                           |
| __statusCode*__    | <em>number</em>                                                                                                                                                                                | The status code returned by the server.                                                                                                                                                                                                            |
| __statusMessage*__ | <em>string</em>                                                                                                                                                                                | The status message set by the server.                                                                                                                                                                                                              |
<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

## `Session` Class

The _Session_ class allows to remember cookies set during all requests. It will maintain an internal state and update cookies when necessary.

#### `constructor(`<br/>&nbsp;&nbsp;`options?: SessionOptions,`<br/>`): Session`

Create an instance of the _Session_ class. All headers specified in the constructor will be present for each request (unless overridden by individual request options).

__<a name="type-sessionoptions">`SessionOptions`</a>__: Options for a session.


|  Name   |                                                                                                 Type                                                                                                  |                      Description                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| host    | <em>string</em>                                                                                                                                                                                       | The prefix to each request, such as `https://rqt.biz`. |
| headers | <em><a href="https://nodejs.org/api/http.html" title="The headers hash map for making requests, including such properties as Content-Encoding, Content-Type, etc.">!http.OutgoingHttpHeaders</a></em> | Headers to use for each request.                       |

The methods in the _Session_ class are proxied to the respective methods in the API, but the cookies and session's headers will be set automatically.

```js
import { Session } from 'rqt'

const SessionRequest = async (url) => {
  // 0. Create a Session.
  const session = new Session({
    host: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 Node.js rqt',
    },
  })

  // 1. Request A JSON Page with Jqt.
  const { SessionKey } = await session.jqt('/StartSession')
  console.log('Session key: %s', SessionKey)

  // 2. Send Form Data And Get Headers With Aqt.
  const {
    statusCode,
    body,
    headers: { location },
  } = await session.aqt('/Login', {
    data: {
      LoginUserName: 'test',
      LoginPassword: 'test',
      sessionEncryptValue: SessionKey,
    },
    type: 'form',
  })
  console.log('%s Redirect: "%s"', statusCode, body)

  // 3. Request A Page As A String With Rqt.
  const res = await session.rqt(location)
  console.log('Page: "%s"', res)
}
```
```
Session key: Example-4736gst4yd
302 Redirect: "Redirecting to <a href="/Portal">/Portal</a>."
Page: "Hello, test"
```

<details>
<summary>Show Server</summary>

```js
import idioCore from '@idio/idio'
import { collect } from 'catchment'
import { parse } from 'querystring'

const Server = async () => {
  const { url, app } = await idioCore({
    async error(ctx, next) {
      try {
        await next()
      } catch ({ message }) {
        ctx.status = 400
        ctx.body = message
      }
    },
    session: { use: true, keys: ['example'] },
    async bodyparser(ctx, next) {
      const data = await collect(ctx.req)
      if (data) ctx.request.body = parse(data)
      await next()
    },
  }, { port: 5002 })
  app.use((ctx) => {
    switch (ctx.path) {
    case '/StartSession':
      ctx.session.SessionKey = 'Example-4736gst4yd'
      ctx.body = {
        SessionKey: ctx.session.SessionKey,
      }
      break
    case '/Login': {
      const { sessionEncryptValue } = ctx.request.body
      if (!sessionEncryptValue) {
        throw new Error('Missing session key.')
      }
      if (sessionEncryptValue != ctx.session.SessionKey) {
        throw new Error('Incorrect session key.')
      }
      ctx.session.user = ctx.request.body.LoginUserName
      ctx.redirect('/Portal')
      break
    }
    case '/Portal':
      if (!ctx.session.user) {
        throw new Error('Not authorized.')
      }
      ctx.body = `Hello, ${ctx.session.user}`
      break
    }
  })
  return url
}

export default Server
```
</details>

#### `async rqt(`<br/>&nbsp;&nbsp;`location: string,`<br/>&nbsp;&nbsp;`options?: AqtOptions,`<br/>`): string`

Request a page as a string. All [options](#options-type) are the same as accepted by the `rqt` functions.

#### `async jqt(`<br/>&nbsp;&nbsp;`location: string,`<br/>&nbsp;&nbsp;`options?: AqtOptions,`<br/>`): Object`

Request a page as an object.

#### `async bqt(`<br/>&nbsp;&nbsp;`location: string,`<br/>&nbsp;&nbsp;`options?: AqtOptions,`<br/>`): !Buffer`

Request a page as a buffer.

#### `async aqt(`<br/>&nbsp;&nbsp;`location: string,`<br/>&nbsp;&nbsp;`options?: AqtOptions,`<br/>`): !AqtReturn`

Request a page and return parsed body, headers and status.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true">
</a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://rqt.biz">Rqt</a> 2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>