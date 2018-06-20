import rqt from '.'

export default class Session {
  constructor(conf = {}) {
    const {
      headers = {},
    } = conf

    this.headers = headers
    this.cookies = {}
  }
  async request({
    location,
    headers = {},
    data,
  }) {
    const { body, headers: h } = await rqt(location, {
      headers: {
        ...this.headers,
        ...headers,
        Cookie: getCookieHeader(this.cookies),
      },
      returnHeaders: true,
    })
    this.cookies = updateCookies(this.cookies, h)
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
  return {
    ...cookies,
    ...extractCookies(headers),
  }
}

const extractCookie = c => {
  const res = /^(.+?)=(.+?);/.exec(c)
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
