import { request as http } from 'http'
import { request as https } from 'https'
import Catchment from 'catchment'
import url from 'url'
import erotic from 'erotic'
import { version } from '../package.json'

/**
 * Request an HTTP page. If `returnHeaders` is set to true, an object will be returned.
 * @param {string} address Url such as http://example.com/api
 * @param {Config} [config] Configuration object
 * @param {object} [config.data] Data to send to the server using a post request.
 * @param {string} [config.contentType] Content-Type header. Default `application/json`.
 * @param {object} [config.headers] A map of headers to use in the request.
 * @param {boolean} [config.binary] Whether to return a buffer. Default false.
 * @param {boolean} [config.returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
 * @returns {Promise.<string|Buffer|{ body: string|Buffer, headers: Object.<string, string> }>} A string or buffer as a response. If `config.headers` was set, an object is returned.
 */
export default async function rqt(address, config = {}) {
  const {
    data = null,
    contentType = 'application/json',
    headers = {
      'User-Agent': `Mozilla/5.0 (Node.js) rqt/${version}`,
    },
    binary = false,
    returnHeaders = false,
  } = config
  const er = erotic(true)
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
  let h
  const body = await new Promise((resolve, reject) => {
    const req = request(
      options,
      async (res) => {
        const catchment = new Catchment({ binary })
        res.pipe(catchment)
        const r = await catchment.promise
        h = res.headers
        if (h['content-type'].startsWith('application/json')) {
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
  if (returnHeaders) return { body, headers: h }
  return body
}

/**
 * @typedef {Object} Config
 * @property {object} [data] Data to send to the server.
 * @property {string} [contentType] Content-Type header.
 * @property {object} [headers] A map of headers.
 * @property {boolean} [binary] Whether to return a buffer.
 * @property {boolean} [returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
 */
