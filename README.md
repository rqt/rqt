# rqt

`rqt` is a Node.js request library.

## `rqt(url):Promise.<string>`

Call this function to request a web page.

```js
const rqt = require('rqt')

rqt('http://rqt.sobes.io')
    .then((res) => {
        console.log(res) // web page
    })
```

---

(c) [sobes.io](https://sobes.io) 2017
