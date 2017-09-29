const assert = require('assert')
const rqt = require('../../src/')
const context = require('../context/')

const rqtTestSuite = {
    context,
    'should be a function': () => {
        assert.equal(typeof rqt, 'function')
    },
    'should request data from server': (ctx) => {
        const testData = 'test-data'
        ctx.data = testData
        return rqt(ctx.url)
            .then((res) => {
                assert(ctx.called)
                assert.equal(res, testData)
            })
    },
    'should fail': () => {
        const url = `http://not-a-valid-web-page-${Math.floor(Math.random() * 10000)}.io`
        return rqt(url)
            .then(() => {
                throw new Error('Should have thrown an error')
            }, (err) => {
                assert.equal(err.code, 'ENOTFOUND')
            })
    },
}

module.exports = rqtTestSuite
