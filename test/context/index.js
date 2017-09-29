const http = require('http')
const enableDestroy = require('server-destroy')

const context = function Context() {
    this.called = 0
    this.data = '200'
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(this.data)
        this.called += 1
    })
    this.server = server
    enableDestroy(this.server)

    this._destroy = () => {
        return new Promise((resolve) => {
            this.server.destroy()
            this.server.on('close', resolve)
        })
    }

    return new Promise((resolve) => {
        server.listen(undefined, 'localhost', resolve)
    })
        .then(() => {
            this.address = server.address()
            this.url = `http://${this.address.address}:${this.address.port}`
        })
}

module.exports = context
