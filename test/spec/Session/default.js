import { equal, deepEqual } from 'zoroaster/assert'
import { HTTPContext } from 'https-context'
import Session from '../../../src/lib/Session'

/** @type {Object.<string, (h: HTTPContext)>} */
const T = {
  context: HTTPContext,
  async 'sets headers for all requests'({ url, getState }) {
    const s = new Session({
      headers: {
        'User-Agent': 'test-ua',
      },
    })
    await s.rqt(url)
    const { headers: h1 } = getState()
    equal(h1['user-agent'], 'test-ua')
    await s.rqt(url)
    const { headers: h2 } = getState()
    equal(h2['user-agent'], 'test-ua')
  },
  async 'overrides instance headers during the request'({ url, getState }) {
    const s = new Session({
      headers: {
        'User-Agent': 'test-ua',
      },
    })
    await s.rqt(url, {
      headers: {
        'User-Agent': 'test-ua-override',
      },
    })
    const { headers } = getState()
    equal(headers['user-agent'], 'test-ua-override')
  },
  async 'sets cookies'({ url, setHeaders }) {
    const s = new Session({
      headers: {
        'User-Agent': 'test-ua',
      },
    })
    const sessionid = '38afes7a8'
    setHeaders({
      'set-cookie': `sessionid=${sessionid}; HttpOnly; Path=/`,
    })
    await s.rqt(url)
    deepEqual(s.cookies, {
      sessionid,
    })
  },
  async 'extends cookies'({ url, setHeaders }) {
    const s = new Session({
      headers: {
        'User-Agent': 'test-ua',
      },
    })
    setHeaders({
      'set-cookie': 'sessionid=38afes7a8; HttpOnly; Path=/',
    })
    await s.rqt(url)
    setHeaders({
      'set-cookie': 'U=123; HttpOnly; Path=/',
    })
    await s.rqt(url)
    deepEqual(s.cookies, {
      sessionid: '38afes7a8',
      U: '123',
    })
  },
  async 'deletes cookies'({ url, setHeaders }) {
    const s = new Session({
      headers: {
        'User-Agent': 'test-ua',
      },
    })
    setHeaders({
      'set-cookie': 'sessionid=38afes7a8; HttpOnly; Path=/',
    })
    await s.rqt(url)
    setHeaders({
      'set-cookie': 'sessionid=; HttpOnly; Path=/',
    })
    await s.rqt(url)
    deepEqual(s.cookies, {})
  },
}

export default T