const { request: http } = require('http')
const { request: https } = require('https')
const Catchment = require('catchment')
const url = require('url')
const erotic = require('erotic')
const { version } =require('../package.json')

/**
 * Request an HTTP page.
 * @param {string} url Url such as http://example.com/api
 */
async function rqt(address, {
  data = null,
  contentType = 'application/json',
  headers = {
    'User-Agent': `Mozilla/5.0 (Node.js) rqt/${version}`,
  },
  binary,
} = {}) {
  const er = erotic()
  const opts = url.parse(address)
  const isHttps = opts.protocol === 'https:'
  const request = isHttps ? https : http
  const options = {
    hostname: opts.hostname,
    port: opts.port,
    path: opts.path,
    headers,
  }
  if (data) {
    options.method = 'POST'
    options.headers = {
      ...options.headers,
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(data),
    }
  }
  const result = await new Promise((resolve, reject) => {
    const req = request(
      options,
      async (res) => {
        const catchment = new Catchment({ binary })
        res.pipe(catchment)
        const r = await catchment.promise
        if (res.headers['content-type'] === 'application/json') {
          try {
            const parsed = JSON.parse(r)
            resolve(parsed)
          } catch (e) {
            const err = er(e)
            err.postData = r
            reject(err)
          }
        } else {
          resolve(r)
        }
      },
    ).on(
      'error',
      (error) => {
        const err = er(error)
        reject(err)
      },
    )
    if (data) {
      req.write(data)
    }
    req.end()
  })
  return result
}

module.exports = rqt
