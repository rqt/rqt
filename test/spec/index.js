import { ok, assert, equal, deepEqual, throws } from 'zoroaster/assert'
import rqt from '../../src'
import Context from '../context'
import { version } from '../../package.json'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
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
      args: [url],
      code: 'ENOTFOUND',
    })
  },
  async 'requests data from https'() {
    const url = 'https://google.com'
    const res = await rqt(url)
    assert(/The document has moved/.test(res))
  },
  async 'sends json data'({ getState, url, data, response }) {
    const res = await rqt(url, {
      data,
    })
    const { called, headers, postData } = getState()
    ok(called)
    equal(headers['content-type'], 'application/json')
    equal(postData, JSON.stringify(data))
    equal(res, response)
  },
  async 'sends form data'({ getState, url, data, response }) {
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
  async 'parses json data'({ url, data, setResponse, setContentType, getState }) {
    setContentType('application/json')
    setResponse(JSON.stringify(data))
    const res = await rqt(url)
    const { called } = getState()
    ok(called)
    deepEqual(res, data)
  },
  async 'parses json data with charset'({ url, data, setResponse, setContentType, getState }) {
    setContentType('application/json; charset=utf8')
    setResponse(JSON.stringify(data))
    const res = await rqt(url)
    const { called } = getState()
    ok(called)
    deepEqual(res, data)
  },
  async 'rejects when cannot parse json data'({ url, setContentType, setResponse }) {
    const data = 'not-json-data'
    setContentType('application/json')
    setResponse(data)
    try {
      await rqt(url)
      throw new Error('Should have thrown an error')
    } catch ({ response, message, stack }) {
      equal(response, data)
      assert(/Unexpected token o/.test(message))
      assert(/ at rejects when cannot parse json data/.test(stack))
    }
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
    })
    const { headers } = getState()
    equal(headers['user-agent'], expected)
  },
  async 'requests github data'() {
    const res = await rqt('https://api.github.com/users/octocat/orgs')
    deepEqual(res, [])
  },
  async 'returns binary data'({ url, setResponse }) {
    const d = 'test buffer'
    setResponse(d)
    const expected = new Buffer(d)
    const res = await rqt(url, {
      binary: true,
    })
    assert(res instanceof Buffer)
    deepEqual(res, expected)
  },
  async 'returns headers'({ setResponse, url, setHeaders }) {
    const data = 'test-response'
    const header = 'hello-world'
    setHeaders({
      'x-test': header,
    })
    setResponse(data)
    const { body, headers } = await rqt(url, {
      returnHeaders: true,
    })
    equal(body, data)
    ok(headers)
    equal(headers['x-test'], header)
  },
}

export default T
