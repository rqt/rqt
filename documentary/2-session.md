## `Session` Class

The _Session_ class allows to remember cookies set during all requests. It will maintain an internal state and update cookies when necessary.

```#### constructor => Session
[
  ["options?", "SessionOptions"]
]
```

Create an instance of the _Session_ class. All headers specified in the constructor will be present for each request (unless overridden by individual request options).

%TYPEDEF types/session.xml%

The methods in the _Session_ class are proxied to the respective methods in the API, but the cookies and session's headers will be set automatically.

%EXAMPLE: example/Session/index, ../../src => rqt%
%FORK example/Session%

<details>
<summary>Show Server</summary>

%EXAMPLE: example/Session/server%
</details>

```#### async rqt => String
[
  ["location", "string"],
  ["options?", "Options"]
]
```

Request a page as a string. All [options](#options-type) are the same as accepted by the `rqt` functions.

```#### async jqt => String
[
  ["location", "string"],
  ["options?", "Options"]
]
```

Request a page as an object.

```#### async bqt => String
[
  ["location", "string"],
  ["options?", "Options"]
]
```

Request a page as a buffer.

```#### async aqt => AqtReturn
[
  ["location", "string"],
  ["options?", "AqtOptions"]
]
```

Request a page and return parsed body, headers and status.

%~%