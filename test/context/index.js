const http = require('http')
const enableDestroy = require('server-destroy')
const Catchment = require('catchment')

const createHandler = (getEndData = () => '200') => {
    const params = {
        postPromise: null,
        called: 0,
    }
    return {
        handler: async (req, res) => {
            params.called += 1
            params.json = req.headers['content-type'] === 'application/json'
            params.headers = req.headers
            if (req.method === 'POST') {
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

const context = async function Context() {
    this.called = 0
    this.data = '200'
    const { handler, params } = createHandler(() => this.data)
    this.params = params
    const server = http.createServer(handler)
    this.server = server
    enableDestroy(this.server)

    this._destroy = async () => {
        await new Promise((resolve) => {
            this.server.destroy()
            this.server.on('close', resolve)
        })
    }
    await new Promise((resolve) => {
        server.listen(undefined, 'localhost', resolve)
    })
    this.address = server.address()
    this.url = `http://${this.address.address}:${this.address.port}`
}

module.exports = context
