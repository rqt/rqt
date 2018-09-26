## API

The package can be used from Node.js as multiple functions for different kinds of requests to make. The main purpose of splitting the package into multiple functions is to be able to get the correct type inference, e.g., a string for `rqt`, buffer for `bqt` and an object for `jqt`, and make it visually perceivable what kind of data is expected from the server. A _Session_ instance can be used to persist cookies across requests.

```js
import rqt, { jqt, bqt, aqt, Session } from 'rqt'
```

<!-- ```table-MACRO Requests
  `$1`, $2, $3
``` -->

```table Requests
[
  ["Function", "Meaning", "Return type"],
  ["[`rqt`](#async-rqturl-stringoptions-options-string)", "String Request", "Request a web page and return the result as a string."],
  ["[`jqt`]((#async-jqturl-stringoptions-options-string))", "JSON Request", "Parse the result as a `JSON` object."],
  ["[`bqt`](#async-bqturl-stringoptions-options-string)", "Binary Request", "The result will be returned as a buffer."],
  ["[`aqt`](#async-aqturl-stringoptions-aqtoptions-aqtreturn)", "Advanced Request", "In addition to the body, the result will contain headers and status, an alias for `@rqt/aqt`."]
]
```

%~%

  <!-- ["`sqt`", "Stream Request", "Result is returned as a stream."], -->
