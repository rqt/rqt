import aqt from '@rqt/aqt'

/**
 * Request an HTTP page and return the response body as a string.
 * @param {string} address Url such as http://example.com/api
 * @param {Options} [options] Options for the request.
 * @param {object} [options.data] Optional data to send to the server with the request.
 * @param {'form'|'json'} [options.type='json'] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default.
 * @param {object} [options.headers] Headers to use for the request.
 * @param {string} [options.method='POST'] What HTTP method to use to send data (only works when `data` is set). Default `POST`.
 * @returns {Promise.<string>} A string as a response.
 */
export default async function rqt(address, options = {}) {
  const { data, type, headers, methaod } = options
  const { body } = await aqt(address, {
    data, type, headers, method,
  })
  return body
}

/**
 * @typedef {Object} Options
 * @property {object} [data] Optional data to send to the server with the request.
 * @property {'form'|'json'} [type='json'] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default.
 * @property {object} [headers] Headers to use for the request.
 * @property {boolean} [method=false] What HTTP method to use to send data (only works when `data` is set). Default `POST`.
 */
