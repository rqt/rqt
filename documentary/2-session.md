### `Session` Class

The _Session_ class allows to remember cookies set during all requests. It will maintain an internal state and update cookies when necessary.

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

%EXAMPLE: example/session.js, ../src => rqt%