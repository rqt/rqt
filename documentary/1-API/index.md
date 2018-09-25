## API

The package can be used from Node.js as multiple functions for different kinds of requests to make. The main purpose of splitting the package into multiple functions is to be able to get the correct type inference, e.g., a string for `rqt`, buffer for `bqt` and an object for `jqt`.

```js
import rqt, { jqt, bqt, sqt, aqt, Session } from 'rqt'
```

<!-- ```table-MACRO Requests
  `$1`, $2, $3
``` -->

```table Requests
[
  ["Function", "Meaning", "Return type"],
  ["[`rqt`](#async-rqturl-stringoptions-options-string)", "String Request", "Request a web page and return the result as a string."],
  ["`jqt`", "JSON Request", "Parse result as a `JSON` object."],
  ["[`bqt`](#async-bqturl-stringoptions-options-string)", "Binary Request", "Result will be returned as a buffer."],
  ["`sqt`", "Stream Request", "Result is returned as a stream."],
  ["`aqt`", "Advanced Request", "Result will contain headers and status code, alias for `@rqt/aqt`."]
]
```

%~%