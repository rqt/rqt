import aqt from '@rqt/aqt'
// import { RequestOptions, ClientRequest, IncomingHttpHeaders, OutgoingHttpHeaders, IncomingMessage } from 'http' // eslint-disable-line

/**
 * Binary Request - request an HTTP page and returns body as a buffer. Use `rqt` for strings and `arqt` for when headers are required.
 * @param {string} address Url such as http://example.com/api
 * @param {Aconfig} [config] Configuration object
 * @param {object} [config.data] Data to send to the server with the request.
 * @param {object} [config.headers] Headers to use in the request.
 * @param {'form'|'json'} [config.type='json'] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default.
 * @param {string} [config.method='POST'] What method to use to send data (only works when `data` is set). Default `POST`.
 * @returns {Promise.<Buffer>} A buffer as a response.
 */
export const brqt = async (address, config) => {
  const c = {
    ...config,
    binary: true,
  }
  const  { body } = await aqt(address, c)
  return body
}

/**
 * Request a page but return a stream (with decompression applied if necessary)
 * @param {string} address Url such as http://example.com/api
 * @param {Aconfig} [config] Configuration object
 * @param {object} [config.data] Data to send to the server with the request.
 * @param {object} [config.headers] Headers to use in the request.
 * @param {'form'|'json'} [config.type='json'] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default.
 * @param {string} [config.method='POST'] What method to use to send data (only works when `data` is set). Default `POST`.
 * @returns {Promise.<Stream>} A buffer as a response.
 */
export const srqt = async (address, config) => {
  throw new Error('not implemented')
  // config.binary = true
  // const  { body } = await arqt(address, config)
  // return body
}

/**
 * Request an HTTP page and return the response body as a string. Use `brqt` for binary and `arqt` for when headers are required.
 * @param {string} address Url such as http://example.com/api
 * @param {Aconfig} [config] Configuration object
 * @param {object} [config.data] Data to send to the server with the request.
 * @param {object} [config.headers] Headers to use in the request.
 * @param {'form'|'json'} [config.type='json'] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default.
 * @param {string} [config.method='POST'] What method to use to send data (only works when `data` is set). Default `POST`.
 * @returns {Promise.<string>} A string as a response.
 */
export default async function rqt(address, config = {}) {
  if (config.binary) process.emitWarning('use brqt for binary requests')
  if (config.returnHeaders) process.emitWarning('use arqt to track headers and status')
  const { body } = await aqt(address, config)
  return body
}

export { default as Session } from './session'


/**
 * @typedef {Object} Config
 * @property {object} [data] Data to send to the server.
 * @property {object} [headers] A map of headers.
 * @property {'form'|'json'} [type] How to send data: `form` for url-encoded transmission and `json` to serialise JSON data.
 * @param {string} [method=POST] What method to use to send data (only works when `data` is set). Default `POST`.
 */


// * @property {boolean} [binary] Whether to return a buffer.
// * @property {boolean} [returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
