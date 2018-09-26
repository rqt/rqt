import { ok, assert, equal, deepEqual, throws } from 'zoroaster/assert'
import rqt from '../../src'
import { HTTPContext } from 'https-context'
import { version } from '../../package.json'

const Data = {
  test: true,
  user: 'test',
  pass: 'zoroaster',
}

/** @type {Object.<string, (c: HTTPContext, cc: Data)>} */
const T = {
  context: [HTTPContext, Data],
  async 'is a function'() {
    equal(typeof rqt, 'function')
  },
  async 'requests data from server' ({ setResponse, getState, url }) {
    const expected = 'test-data'
    setResponse(expected)
    const res = await rqt(url)
    const { called } = getState()
    ok(called)
    equal(res, expected)
  },
  async 'fails when ENOTFOUND'() {
    const url = `http://not-a-valid-web-page-${Math.floor(Math.random() * 10000)}.io`
    await throws({
      fn: rqt,
      args: url,
      code: 'ENOTFOUND',
    })
  },
  async 'requests data from https'() {
    const url = 'https://google.com'
    const res = await rqt(url)
    assert(/The document has moved/.test(res))
  },
  async 'sends json data'({ getState, url, response }, data) {
    const res = await rqt(url, {
      data,
    })
    const { called, headers, postData } = getState()
    ok(called)
    equal(headers['content-type'], 'application/json')
    equal(postData, JSON.stringify(data))
    equal(res, response)
  },
  async 'sends form data'({ getState, url, response }, data) {
    const res = await rqt(url, {
      data,
      type: 'form',
    })
    const { called, headers, postData } = getState()
    ok(called)
    equal(headers['content-type'], 'application/x-www-form-urlencoded')
    equal(postData, Object.keys(data).map(k => `${k}=${data[k]}`).join('&'))
    equal(res, response)
  },
  async 'sends headers'({ url, getState }) {
    const testHeader = 'test post header'
    await rqt(url, {
      data: 'test',
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        'x-test': testHeader,
      },
    })
    const { headers } = getState()
    equal(headers['x-test'], testHeader)
  },
  async 'sends user-agent'({ url, getState }) {
    const expected = `Mozilla/5.0 (Node.js) rqt/${version}`
    await rqt(url, {
      data: 'test',
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        'User-Agent': expected,
      },
    })
    const { headers } = getState()
    equal(headers['user-agent'], expected)
  },
  async 'requests github data'() {
    const res = await rqt('https://api.github.com/users/octocat/orgs')
    deepEqual(res, [])
  },
}

export default T
