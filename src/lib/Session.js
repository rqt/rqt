import aqt from '@rqt/aqt'

/**
 * An instance of a session class can maintain cookies.
 */
export default class Session {
  /**
   * Create a new session that can be used to make requests in sequence, and remember cookies.
   * @param {SessionOptions} options Options for a session.
 * @param {string} [options.host] The prefix to each request, such as `https://rqt.biz`.
 * @param {OutgoingHttpHeaders} [options.headers] Headers to use for each request.
   */
  constructor(options = {}) {
    const {
      host,
      headers = {},
    } = options

    this.host = host
    this.headers = headers
    this.cookies = {}
  }
  /**
   * Make a request and return the body.
   * @param {string} location The URL to which to make a request.
   * @param {Options} options Options for requests.
 * @param {*} [options.data] Optional data to send to the server with the request.
 * @param {'form'|'json'} [options.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @param {OutgoingHttpHeaders} [options.headers] Headers to use for the request.
 * @param {boolean} [options.compress=true] Add the `Accept-Encoding: gzip, deflate` header automatically to indicate to the server that it can send a compressed response. Default `true`.
 * @param {string} [options.method="POST"] What HTTP method to use to send data. Default `POST`.
   */
  async rqt(location, options = {}) {
    const { body } = await this._request(location, options)
    return body
  }
  /**
   * Make a request and return the parsed JSON body as an object.
   * @param {string} location The URL to which to make a request.
   * @param {Options} options Options for requests.
 * @param {*} [options.data] Optional data to send to the server with the request.
 * @param {'form'|'json'} [options.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @param {OutgoingHttpHeaders} [options.headers] Headers to use for the request.
 * @param {boolean} [options.compress=true] Add the `Accept-Encoding: gzip, deflate` header automatically to indicate to the server that it can send a compressed response. Default `true`.
 * @param {string} [options.method="POST"] What HTTP method to use to send data. Default `POST`.
   */
  async jqt(location, options = {}) {
    const { body } = await this._request(location, options)
    return body
  }
  getFullUrl(location) {
    if (this.host) {
      return `${this.host}${location}`
    }
    return location
  }
  /**
   * Make a request and return the body, headers and status.
   * @param {string} location The URL to which to make a request.
   * @param {Options} options Options for requests.
 * @param {*} [options.data] Optional data to send to the server with the request.
 * @param {'form'|'json'} [options.type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @param {OutgoingHttpHeaders} [options.headers] Headers to use for the request.
 * @param {boolean} [options.compress=true] Add the `Accept-Encoding: gzip, deflate` header automatically to indicate to the server that it can send a compressed response. Default `true`.
 * @param {string} [options.method="POST"] What HTTP method to use to send data. Default `POST`.
   */
  async aqt(location, options = {}) {
    const res = await this._request(location, options)
    return res
  }
  async _request(location, options = {}) {
    const loc = this.getFullUrl(location)
    const opts = getAllOptions(this.headers, options, this.Cookie)
    const res = await aqt(loc, opts)
    const { headers } = res
    this.cookies = updateCookies(this.cookies, headers)
    return res
  }
  get Cookie() {
    return getCookieHeader(this.cookies)
  }
}

const getAllOptions = (sessionHeaders, options, Cookie) => {
  const {
    headers = {},
    ...opts
  } = options
  return {
    ...opts,
    headers: {
      ...sessionHeaders,
      ...headers,
      Cookie,
    },
  }
}

const getCookieHeader = (cookies) => {
  const r = Object.keys(cookies).reduce((acc, key) => {
    const val = cookies[key]
    const s = `${key}=${val}`
    return [...acc, s]
  }, [])
  return r.join('; ')
}

/**
 * @param {Object} cookies
 * @param {import('http').IncomingHttpHeaders} headers
 */
const updateCookies = (cookies, headers) => {
  const newCookies = extractCookies(headers)
  const r = {
    ...cookies,
    ...newCookies,
  }
  const res = Object.keys(r).reduce((acc, current) => {
    const val = r[current]
    if (!val) return acc
    return {
      ...acc,
      [current]: val,
    }
  }, {})
  return res
}

const extractCookie = c => {
  const res = /^(.+?)=(.*?);/.exec(c)
  if (!res) throw new Error(`Could not extract a cookie from ${c}`)
  const [, name, value] = res
  return {
    [name]: value,
  }
}
const extractCookies = ({ 'set-cookie': setCookie = [] } = {}) => {
  return setCookie.reduce((acc, current) => {
    const c = extractCookie(current)
    return {
      ...acc,
      ...c,
    }
  }, {})
}

/**
 * @typedef {Object} SessionOptions
 * @prop {OutgoingHttpHeaders} [headers] Headers to send with each request.
 */

/* documentary types/options.xml */
/**
 * @typedef {import('http').OutgoingHttpHeaders} OutgoingHttpHeaders
 *
 * @typedef {Object} Options Options for requests.
 * @prop {*} [data] Optional data to send to the server with the request.
 * @prop {'form'|'json'} [type="'json'"] How to send data: `json` to serialise JSON data and `form` for url-encoded transmission with `json` mode by default. Default `'json'`.
 * @prop {OutgoingHttpHeaders} [headers] Headers to use for the request.
 * @prop {boolean} [compress=true] Add the `Accept-Encoding: gzip, deflate` header automatically to indicate to the server that it can send a compressed response. Default `true`.
 * @prop {string} [method="POST"] What HTTP method to use to send data. Default `POST`.
 */

/* documentary types/session.xml */
/**
 * @typedef {Object} SessionOptions Options for a session.
 * @prop {string} [host] The prefix to each request, such as `https://rqt.biz`.
 * @prop {OutgoingHttpHeaders} [headers] Headers to use for each request.
 */