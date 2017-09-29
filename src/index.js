const http = require('http')
const debuglog = require('util').debuglog('rqt')
const Catchment = require('catchment')

/**
 * Request an HTTP page.
 * @param {string} url Url such as http://example.com/api
 */
function rqt(url) {
    debuglog('rqt %s', url)
    return new Promise((resolve, reject) => {
        const request = http.request(url, (res) => {
            const catchment = new Catchment()
            res.pipe(catchment)
            catchment._promise.then(resolve)
        })
        request.on('error', reject)
        request.end()
    })
}

module.exports = rqt
