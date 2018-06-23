import { request as http  } from 'http'
// import { RequestOptions, ClientRequest, IncomingHttpHeaders, IncomingMessage } from 'http'
import { request as https } from 'https'
import Catchment from 'catchment'
import { parse } from 'url'
import erotic from 'erotic'
import { debuglog } from 'util'
import { createGunzip } from 'zlib'
import { getFormData } from './lib'
import { version } from '../package.json'

const LOG = debuglog('rqt')


const getData = (type, data) => {
  switch (type) {
  case 'json':
    data = JSON.stringify(data)
    type = 'application/json'
    break
  case 'form':
    data = getFormData(data)
    type = 'application/x-www-form-urlencoded'
    break
  }
  return {
    data,
    contentType: type,
  }
}
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
    data: d,
    type = 'json',
    headers: outgoingHeaders = {
      'User-Agent': `Mozilla/5.0 (Node.js) rqt/${version}`,
    },
    binary = false,
    returnHeaders = false,
    method = 'POST',
    justHeaders = false,
  } = config
  const er = erotic(true)

  const { hostname, protocol, port, path } = parse(address)
  const isHttps = protocol === 'https:'
  const request = isHttps ? https : http

  const options = {
    hostname,
    port,
    path,
    headers: outgoingHeaders,
  }

  let data
  if (d) {
    const _d = getData(type, d)
      ; ({ data } = _d)
    const { contentType } = _d

    options.method = method
    options.headers['Content-Type'] = contentType
    options.headers['Content-Length'] = Buffer.byteLength(data)
  }

  const { body, headers, byteLength, statusCode, statusMessage, rawLength } = await exec(request, options, {
    data,
    justHeaders,
    binary,
    er,
  })

  LOG('%s %s B%s', address, byteLength, `${byteLength != rawLength ? ` (raw ${rawLength} B)` : ''}`)

  if (returnHeaders) return { body, headers, statusCode, statusMessage }
  return body
}

/**
 * @param {IncomingMessage.headers} headers
 */
const isHeadersJson = (headers) => {
  return headers['content-type'].startsWith('application/json')
}

/**
 * @param {IncomingMessage} req
 */
const isMessageGzip = (res) => {
  return res.headers['content-encoding'] == 'gzip'
}
/**
 * @param {http} request actual http or https request function
 * @param {RequestOptions} requestOptions
 * @param {object} config Config object.
 * @param {boolean} [config.justHeaders] only return headers as soon as available. false
 * @param {boolean} [config.binary] return binary
 * @param {boolean} [config.er] erotic callback
 * @returns {{req: ClientRequest, promise: Promise.<{ body?: string|Buffer, headers: IncomingHttpHeaders, statusCode: number, statusMessage: string, byteLength: number }>}
 */
const makeRequest = (request, requestOptions, config) => {
  const { justHeaders, binary, er = erotic(true) } = config
  let req
  const promise = new Promise((r, j) => {
    let meta
    req = request(requestOptions, async (res) => {
      const { headers, statusMessage, statusCode } = res
      meta = { statusMessage, statusCode }
      if (justHeaders) {
        res.destroy()
        r({ headers, ...meta })
        return
      }
      const isGzip = isMessageGzip(res)

      let rawLength = 0
      res.on('data', data => rawLength += data.byteLength )

      const rs = isGzip
        ? res.pipe(createGunzip())
        : res


      const { promise: p } = new Catchment({ rs, binary })
      let body = await p
      r({ body, headers, ...meta, byteLength: body.length, rawLength })
    })
      .on('error', (error) => {
        const err = er(error)
        j(err)
      })
  })
  return { req, promise }
}
const exec = async (request, requestOptions, { data, justHeaders, binary, er = erotic(true) }) => {
  const { req, promise } = makeRequest(request, requestOptions, {
    justHeaders,
    binary,
    er,
  })
  if (data) {
    req.write(data, () => {
      req.end()
    })
  } else {
    req.end()
  }
  const res = await promise

  const isJson = isHeadersJson(res.headers)

  if (isJson) {
    try {
      res.body = JSON.parse(res.body)
    } catch (e) {
      const err = er(e)
      err.response = res.body
      throw err
    }
  }

  return res
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
