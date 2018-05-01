const { assert, equal, deepEqual, throws } = require('zoroaster/assert')
const rqt = require('../../src/')
const context = require('../context/')
const { version } = require('../../package.json')

const rqtTestSuite = {
  context,
  async 'should be a function'() {
    equal(typeof rqt, 'function')
  },
  async 'should request data from server' (ctx) {
    const testData = 'test-data'
    ctx.data = testData
    const res = await rqt(ctx.url)
    assert(ctx.params.called)
    equal(res, testData)
  },
  async 'should fail'() {
    const url = `http://not-a-valid-web-page-${Math.floor(Math.random() * 10000)}.io`
    await throws({
      fn: rqt,
      args: [url],
      code: 'ENOTFOUND',
    })
  },
  async 'should request data from https'() {
    const url = 'https://google.com'
    const res = await rqt(url)
    assert(/The document has moved/.test(res))
  },
  async 'should send post data'(ctx) {
    const data = 'test post data'
    const res = await rqt(ctx.url, {
      data,
      contentType: 'application/x-www-form-urlencoded',
    })
    assert(ctx.params.called)
    equal(res, data)
  },
  async 'should parse json data'(ctx) {
    const rawData = { data: 'test post data' }
    const data = JSON.stringify(rawData)
    const res = await rqt(ctx.url, {
      data,
    })
    assert(ctx.params.called)
    deepEqual(res, rawData)
  },
  async 'should reject when cannot parse json data'(ctx) {
    const data = 'not-json-data'
    try {
      await rqt(ctx.url, {
        data,
      })
      throw new Error('Should have thrown an error')
    } catch ({ postData, message, stack }) {
      assert.equal(postData, data)
      assert(/Unexpected token o/.test(message))
      assert(/ at should reject when cannot parse json data/.test(stack))
    }
  },
  async 'should send headers'(ctx) {
    const testHeader = 'test post header'
    await rqt(ctx.url, {
      data: 'test',
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        'x-test': testHeader,
      },
    })
    equal(ctx.params.headers['x-test'], testHeader)
  },
  async 'should send user-agent'(ctx) {
    const expected = `Mozilla/5.0 (Node.js) rqt/${version}`
    await rqt(ctx.url, {
      data: 'test',
      contentType: 'application/x-www-form-urlencoded',
    })
    equal(ctx.params.headers['user-agent'], expected)
  },
  async 'should request github data'() {
    const res = await rqt('https://api.github.com/users/octocat/orgs')
    equal(res, '[]')
  },
  async 'should return binary data'(ctx) {
    ctx.data = 'test buffer'
    const expected = new Buffer(ctx.data)
    const res = await rqt(ctx.url, {
      binary: true,
    })
    assert(res instanceof Buffer)
    deepEqual(res, expected)
  },
}

module.exports = rqtTestSuite
