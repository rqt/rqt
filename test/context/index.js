import { createServer } from 'http'
import enableDestroy from 'server-destroy'
import Catchment from 'catchment'

const createHandler = (getEndData = () => '200') => {
  const params = {
    postPromise: null,
    called: 0,
    json: false,
    headers: {},
  }
  return {
    handler: async (req, res) => {
      params.called += 1
      params.json = req.headers['content-type'] == 'application/json'
      params.headers = req.headers
      if (req.method == 'POST') {
        const catchment = new Catchment
        req.pipe(catchment)
        const { promise } = catchment
        params.postPromise = promise
        if (params.json) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' })
        }
        const data = await promise
        res.end(data)
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        const data = getEndData()
        res.end(data)
      }
    },
    params,
  }
}

export default class Context {
  constructor() {
    this.called = 0
    this.data = '200'
  }
  async _destroy() {
    await new Promise((resolve) => {
      this.server.destroy()
      this.server.on('close', resolve)
    })
  }
  getParams() {
    return this.params
  }
  setData(data) {
    this.data = data
  }
  async _init() {
    const { handler, params } = createHandler(() => this.data)
    this.params = params

    const server = createServer(handler)
    this.server = server
    enableDestroy(this.server)

    await new Promise((resolve) => {
      this.server.listen(undefined, 'localhost', resolve)
    })
    this.address = server.address()
    this.url = `http://${this.address.address}:${this.address.port}`
  }
}
