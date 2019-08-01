import aqt from '@rqt/aqt'

/**
 * An instance of a session class can maintain cookies.
 * @implements {_rqt.Session}
 */
export default class Session {
  /**
   * Create a new session that can be used to make requests in sequence, and remember cookies.
   * @param {!_rqt.SessionOptions} options Options for a session.
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
   * @param {!_rqt.AqtOptions} options Options for requests.
   */
  async rqt(location, options = {}) {
    const { body } = await this._request(location, options)
    /** @type {string} */
    const r = body
    return r
  }
  /**
   * Make a request and return the body as buffer.
   * @param {string} location The URL to which to make a request.
   * @param {!_rqt.AqtOptions} options Options for requests.
   */
  async bqt(location, options = {}) {
    const { body } = await this._request(location, {
      ...options,
      binary: true,
    })
    /** @type {!Buffer} */
    const r = body
    return r
  }
  /**
   * Make a request and return the parsed JSON body as an object.
   * @param {string} location The URL to which to make a request.
   * @param {!_rqt.AqtOptions} options Options for requests.
   */
  async jqt(location, options = {}) {
    const { body } = await this._request(location, options)
    /** @type {!Object} */
    const r = body
    return r
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
   * @param {!_rqt.AqtOptions} options Configuration for requests.
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
 * @param {!Object} cookies
 * @param {!http.IncomingHttpHeaders} headers
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
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/aqt').AqtOptions} _rqt.AqtOptions
 */