import rqt from '.'

/**
 * An instance of a session class can maintain cookies.
 */
export default class Session {
  /**
   * A session can be used when requests need to be made in sequence, and rely on cookies.
   * @param {Conf} options Configuration object.
   * @param {OutgoingHttpHeaders} [conf.headers] Headers to send with each request.
   */
  constructor(options = {}) {
    const {
      headers = {},
    } = options

    this.headers = headers
    this.cookies = {}
  }
  /**
   * @param {string} location The URL to which to make a request.
   */
  async request(location, params = {}) {
    const {
      headers = {},
      ...options
    } = params
    const { body, headers: h } = await rqt(location, {
      ...options,
      headers: {
        ...this.headers,
        ...headers,
        Cookie: getCookieHeader(this.cookies),
      },
      returnHeaders: true,
    })
    this.cookies = updateCookies(this.cookies, h)
    return options.returnHeaders ? { body, headers: h } : body
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

const updateCookies = (cookies, headers) => {
  const r = {
    ...cookies,
    ...extractCookies(headers),
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
  return {
    [res[1]]: res[2],
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
 * @typedef {import('http').OutgoingHttpHeaders} OutgoingHttpHeaders
 * @typedef {Object} Conf
 * @property {OutgoingHttpHeaders} [headers] Headers to send with each request.
 */
