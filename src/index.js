import { request as http } from 'http'
import { request as https } from 'https'
import Catchment from 'catchment'
import { parse } from 'url'
import erotic from 'erotic'
import { getFormData } from './lib'
import { version } from '../package.json'

/**
 * Request an HTTP page. If `returnHeaders` is set to true, an object will be returned.
 * @param {string} address Url such as http://example.com/api
 * @param {Config} [config] Configuration object
 * @param {object} [config.data] Data to send to the server using a post request.
 * @param {object} [config.headers] A map of headers to use in the request.
 * @param {boolean} [config.binary] Whether to return a buffer. Default false.
 * @param {boolean} [config.returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
 * @param {'form'|'json'} [config.type=json] How to send data: `form` for url-encoded transmission and `json` to serialise JSON data. `json` mode by default.
 * @param {string} [config.method] What method to use to send data (only works when `data` is set). Default `POST`.
 * @returns {Promise.<string|Buffer|{ body: string|Buffer, headers: Object.<string, string> }>} A string or buffer as a response. If `config.headers` was set, an object is returned.
 */
export default async function rqt(address, config = {}) {
  const {
    data,
    type = 'json',
    headers = {
      'User-Agent': `Mozilla/5.0 (Node.js) rqt/${version}`,
    },
    binary = false,
    returnHeaders = false,
    method = 'POST',
  } = config
  const er = erotic(true)

  const { hostname, protocol, port, path } = parse(address)
  const isHttps = protocol === 'https:'
  const request = isHttps ? https : http

  const options = {
    hostname,
    port,
    path,
    headers,
  }

  let d = data

  if (d) {
    let contentType
    switch (type) {
    case 'json':
      d = JSON.stringify(data)
      contentType = 'application/json'
      break
    case 'form':
      d = getFormData(data)
      contentType = 'application/x-www-form-urlencoded'
      break
    }

    options.method = method
    options.headers['Content-Type'] = contentType
    options.headers['Content-Length'] = Buffer.byteLength(d)
  }

  let h
  const body = await new Promise((resolve, reject) => {
    const req = request(
      options,
      async (rs) => {
        ({ headers: h } = rs)
        const { promise } = new Catchment({ rs, binary })
        const response = await promise
        if (h['content-type'].startsWith('application/json')) {
          try {
            const parsed = JSON.parse(response)
            resolve(parsed)
          } catch (e) {
            const err = er(e)
            err.response = response
            reject(err)
          }
        } else {
          resolve(response)
        }
      },
    ).on(
      'error',
      (error) => {
        const err = er(error)
        reject(err)
      },
    )
    if (d) {
      req.write(d)
    }
    req.end()
  })
  if (returnHeaders) return { body, headers: h }
  return body
}

export { default as Session } from './session'

/**
 * @typedef {Object} Config
 * @property {object} [data] Data to send to the server.
 * @property {object} [headers] A map of headers.
 * @property {boolean} [binary] Whether to return a buffer.
 * @property {boolean} [returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
 * @property {'form'|'json'} [type] How to send data: `form` for url-encoded transmission and `json` to serialise JSON data.
 * @param {string} [method=POST] What method to use to send data (only works when `data` is set). Default `POST`.
 */
