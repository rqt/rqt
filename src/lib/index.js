import aqt from '@rqt/aqt'

/**
 * Request an HTTP page and return the response body as a string.
 * @param {string} address Url such as http://example.com/api.
 * @param {!_rqt.AqtOptions} [options] Options for requests.
 */
export const rqt = async (address, options = {}) => {
  const { body } = await aqt(address, options)
  /** @type {string} */
  const r = body
  return r
}

/**
 * Request an HTTP page and return the response body as an object.
 * @param {string} address Url such as http://example.com/api.
 * @param {!_rqt.AqtOptions} [options] Options for requests.
 */
export const jqt = async (address, options = {}) => {
  const { body } = await aqt(address, options)
  /** @type {*} */
  const r = body
  return r
}

/**
 * Request a page and return the body as a buffer.
 * @param {string} address The URL such as http://example.com/api.
 * @param {!_rqt.AqtOptions} [options] Options for requests.
 */
export const bqt = async (address, options) => {
  const c = {
    ...options,
    binary: true,
  }
  const  { body } = await aqt(address, c)
  /** @type {!Buffer} */
  const r = body
  return r
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/aqt').AqtOptions} _rqt.AqtOptions
 */

// /**
//  * Request a page and return the body as a stream.
//  * @param {string} address Url such as http://example.com/api
//  * @param {Options} [config] Options for requests.
//  * @param {*} [config.data] Optional data to send to the server with the request.
//  * @param {'form'|'json'} [config.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
//  * @param {http.OutgoingHttpHeaders} [config.headers] Headers to use for the request.
//  * @param {boolean} [config.compress=true] Add the `Accept-Encoding: gzip, deflate` header to indicate to the server that it can send a compressed response. Default `true`.
//  * @param {string} [config.method] What HTTP method to use in making of the request. When no method is given and `data` is present, defaults to `POST`.
//  * @param {number} [config.timeout] Timeout after which the request should cancel.
//  */
// export const srqt = async (address, config) => {
//   throw new Error('not implemented')
//   // config.binary = true
//   // const  { body } = await arqt(address, config)
//   // return body
// }
