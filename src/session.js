import rqt from '.'

export default class Session {
  /**
   * A session can be used when requests need to be made in sequence, and rely on cookies.
   * @param {Conf} conf Configuration object.
   * @param {Object.<string, string>} [conf.headers] Headers to send with each request.
   */
  constructor(conf = {}) {
    const {
      headers = {},
    } = conf

    this.headers = headers
    this.cookies = {}
  }
  async request(location, {
    headers = {},
    options = {},
  } = {}) {
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
    return body
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
 * @typedef {Object} Conf
 * @property {Object.<string, string>} [headers] Headers to send with each request.
 */
