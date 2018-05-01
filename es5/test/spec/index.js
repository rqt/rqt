var _require = require('zoroaster/assert'),
    assert = _require.assert,
    equal = _require.equal,
    deepEqual = _require.deepEqual,
    throws = _require.throws;

var rqt = require('../../src/');

var context = require('../context/');

var _require2 = require("../../../package.json"),
    version = _require2.version;

var rqtTestSuite = {
  context,

  'should be a function'() {
    return new Promise(function ($return, $error) {
      equal(typeof rqt, 'function');
      return $return();
    }.bind(this));
  },

  'should request data from server'(ctx) {
    return new Promise(function ($return, $error) {
      var testData, res;
      testData = 'test-data';
      ctx.data = testData;
      return Promise.resolve(rqt(ctx.url)).then(function ($await_2) {
        try {
          res = $await_2;
          assert(ctx.params.called);
          equal(res, testData);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should fail'() {
    return new Promise(function ($return, $error) {
      var url;
      url = `http://not-a-valid-web-page-${Math.floor(Math.random() * 10000)}.io`;
      return Promise.resolve(throws({
        fn: rqt,
        args: [url],
        code: 'ENOTFOUND'
      })).then(function ($await_3) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should request data from https'() {
    return new Promise(function ($return, $error) {
      var url, res;
      url = 'https://google.com';
      return Promise.resolve(rqt(url)).then(function ($await_4) {
        try {
          res = $await_4;
          assert(/The document has moved/.test(res));
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should send post data'(ctx) {
    return new Promise(function ($return, $error) {
      var data, res;
      data = 'test post data';
      return Promise.resolve(rqt(ctx.url, {
        data,
        contentType: 'application/x-www-form-urlencoded'
      })).then(function ($await_5) {
        try {
          res = $await_5;
          assert(ctx.params.called);
          equal(res, data);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should parse json data'(ctx) {
    return new Promise(function ($return, $error) {
      var rawData, data, res;
      rawData = {
        data: 'test post data'
      };
      data = JSON.stringify(rawData);
      return Promise.resolve(rqt(ctx.url, {
        data
      })).then(function ($await_6) {
        try {
          res = $await_6;
          assert(ctx.params.called);
          deepEqual(res, rawData);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should reject when cannot parse json data'(ctx) {
    return new Promise(function ($return, $error) {
      var data, postData, message, stack;
      data = 'not-json-data';

      var $Try_1_Post = function () {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this);

      var $Try_1_Catch = function (_ref) {
        try {
          postData = _ref.postData;
          message = _ref.message;
          stack = _ref.stack;
          assert.equal(postData, data);
          assert(/Unexpected token o/.test(message));
          assert(/ at should reject when cannot parse json data/.test(stack));
          return $Try_1_Post();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this);

      try {
        return Promise.resolve(rqt(ctx.url, {
          data
        })).then(function ($await_7) {
          try {
            throw new Error('Should have thrown an error');
          } catch ($boundEx) {
            return $Try_1_Catch($boundEx);
          }
        }.bind(this), $Try_1_Catch);
      } catch (_ref) {
        $Try_1_Catch(_ref)
      }
    }.bind(this));
  },

  'should send headers'(ctx) {
    return new Promise(function ($return, $error) {
      var testHeader;
      testHeader = 'test post header';
      return Promise.resolve(rqt(ctx.url, {
        data: 'test',
        contentType: 'application/x-www-form-urlencoded',
        headers: {
          'x-test': testHeader
        }
      })).then(function ($await_8) {
        try {
          equal(ctx.params.headers['x-test'], testHeader);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should send user-agent'(ctx) {
    return new Promise(function ($return, $error) {
      var expected;
      expected = `Mozilla/5.0 (Node.js) rqt/${version}`;
      return Promise.resolve(rqt(ctx.url, {
        data: 'test',
        contentType: 'application/x-www-form-urlencoded'
      })).then(function ($await_9) {
        try {
          equal(ctx.params.headers['user-agent'], expected);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should request github data'() {
    return new Promise(function ($return, $error) {
      var res;
      return Promise.resolve(rqt('https://api.github.com/users/octocat/orgs')).then(function ($await_10) {
        try {
          res = $await_10;
          equal(res, '[]');
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should return binary data'(ctx) {
    return new Promise(function ($return, $error) {
      var expected, res;
      ctx.data = 'test buffer';
      expected = new Buffer(ctx.data);
      return Promise.resolve(rqt(ctx.url, {
        binary: true
      })).then(function ($await_11) {
        try {
          res = $await_11;
          assert(res instanceof Buffer);
          deepEqual(res, expected);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = rqtTestSuite;