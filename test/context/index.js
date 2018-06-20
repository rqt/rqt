import { createServer } from 'http'
import enableDestroy from 'server-destroy'
import Catchment from 'catchment'

export default class Context {
  constructor() {
    this.called = 0
    this._response = 'OK'
    this.headers = {}

    this.state = {
      postPromise: null,
      called: 0,
      headers: {},
      postData: null,
    }
  }
  async _destroy() {
    await new Promise((resolve) => {
      this.server.destroy()
      this.server.on('close', resolve)
    })
  }
  get response() {
    return this._response
  }
  getState() {
    return this.state
  }
  setResponse(data) {
    this._response = data
  }
  setHeaders(headers) {
    this.headers = headers
  }
  async _init() {
    const server = createServer(this.handler.bind(this))
    this.server = server
    enableDestroy(this.server)

    await new Promise((resolve) => {
      this.server.listen(undefined, 'localhost', resolve)
    })
    this.address = server.address()
    this.url = `http://${this.address.address}:${this.address.port}`
  }
  setContentType(contentType) {
    this.contentType = contentType
  }

  async handler(req, res) {
    this.state.called += 1
    this.state.headers = req.headers

    res.writeHead(200, { 'Content-Type': this.contentType || 'text/plain', ...this.headers })

    if (req.method != 'GET') {
      const catchment = new Catchment
      req.pipe(catchment)
      const { promise } = catchment
      const postData = await promise
      this.state.postData = postData
    }

    res.end(this._response)
  }

  get data() {
    return {
      hello: 'world',
      login: 'user',
      password: 123456,
    }
  }
}
