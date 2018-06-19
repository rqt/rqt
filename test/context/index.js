import { createServer } from 'http'
import enableDestroy from 'server-destroy'
import Catchment from 'catchment'

export default class Context {
  constructor() {
    this.called = 0
    this.data = '200'
    this.headers = {}

    this.state = {
      postPromise: null,
      called: 0,
      json: false,
      headers: {},
    }
  }
  async _destroy() {
    await new Promise((resolve) => {
      this.server.destroy()
      this.server.on('close', resolve)
    })
  }
  getState() {
    return this.state
  }
  setData(data) {
    this.data = data
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

  async handler(req, res) {
    this.state.called += 1
    this.state.json = req.headers['content-type'] == 'application/json'
    this.state.headers = req.headers
    if (req.method == 'POST') {
      const catchment = new Catchment
      req.pipe(catchment)
      const { promise } = catchment
      this.state.postPromise = promise
      if (this.state.json) {
        res.writeHead(200, { 'Content-Type': 'application/json', ...this.headers })
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain', ...this.headers })
      }
      const data = await promise
      res.end(data)
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain', ...this.headers })
      res.end(this.data)
    }
  }
}
