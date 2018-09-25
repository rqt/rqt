import aqt from '@rqt/aqt'

/**
 * Request an HTTP page and return the response body as a string.
 * @param {string} address Url such as http://example.com/api.
 * @param {Options} [options] Options for requests.
 * @param {*} options.data Optional data to send to the server with the request.
 * @param {'form'|'json'} [options.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @param {OutgoingHttpHeaders} [options.headers] Headers to use for the request.
 * @param {string} [options.method="POST"] What HTTP method to use to send data. Default `POST`.
 */
export const rqt = async (address, options = {}) => {
  const { data, type, headers, method } = options
  const { body } = await aqt(address, {
    data, type, headers, method,
  })
  /** @type {string} */
  const r = body
  return r
}

/**
 * Request a page and return the body as a buffer.
 * @param {string} address The URL such as http://example.com/api.
 * @param {Options} [config] Options for requests.
 * @param {*} config.data Optional data to send to the server with the request.
 * @param {'form'|'json'} [config.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @param {OutgoingHttpHeaders} [config.headers] Headers to use for the request.
 * @param {string} [config.method="POST"] What HTTP method to use to send data. Default `POST`.
 */
export const bqt = async (address, config) => {
  const c = {
    ...config,
    binary: true,
  }
  const  { body } = await aqt(address, c)
  /** @type {Buffer} */
  const r = body
  return r
}

/**
 * Request a page and return the body as a stream.
 * @param {string} address Url such as http://example.com/api
 * @param {Options} [config] Options for requests.
 * @param {*} config.data Optional data to send to the server with the request.
 * @param {'form'|'json'} [config.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @param {OutgoingHttpHeaders} [config.headers] Headers to use for the request.
 * @param {string} [config.method="POST"] What HTTP method to use to send data. Default `POST`.
 */
export const srqt = async (address, config) => {
  throw new Error('not implemented')
  // config.binary = true
  // const  { body } = await arqt(address, config)
  // return body
}

/* documentary types/options.xml */
/**
 * @typedef {import('http').OutgoingHttpHeaders} OutgoingHttpHeaders
 *
 * @typedef {Object} Options Options for requests.
 * @prop {*} data Optional data to send to the server with the request.
 * @prop {'form'|'json'} [type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @prop {OutgoingHttpHeaders} [headers] Headers to use for the request.
 * @prop {string} [method="POST"] What HTTP method to use to send data. Default `POST`.
 */
