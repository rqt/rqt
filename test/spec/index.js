const assert = require('assert')
const rqt = require('../../src/')

const rqtTestSuite = {
    'should be a function': () => {
        assert.equal(typeof rqt, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            rqt()
        })
    },
}

module.exports = rqtTestSuite
