var _require = require('http'),
    http = _require.request;

var _require2 = require('https'),
    https = _require2.request;

var Catchment = require("catchment/es5");

var url = require('url');

var erotic = require("erotic/es5/src");

var _require3 = require("../../package.json"),
    version = _require3.version;
/**
 * Request an HTTP page.
 * @param {string} url Url such as http://example.com/api
 */


function rqt(address) {
  var $args = arguments;
  return new Promise(function ($return, $error) {
    var _ref, _ref$data, data, _ref$contentType, contentType, _ref$headers, headers, er, opts, isHttps, request, options, result;

    _ref = $args.length > 1 && $args[1] !== undefined ? $args[1] : {}, _ref$data = _ref.data, data = _ref$data === void 0 ? null : _ref$data, _ref$contentType = _ref.contentType, contentType = _ref$contentType === void 0 ? 'application/json' : _ref$contentType, _ref$headers = _ref.headers, headers = _ref$headers === void 0 ? {
      'User-Agent': `Mozilla/5.0 (Node.js) rqt/${version}`
    } : _ref$headers;
    er = erotic();
    opts = url.parse(address);
    isHttps = opts.protocol === 'https:';
    request = isHttps ? https : http;
    options = {
      hostname: opts.hostname,
      port: opts.port,
      path: opts.path,
      headers
    };

    if (data) {
      options.method = 'POST';
      options.headers = Object.assign({}, options.headers, {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(data)
      });
    }

    return Promise.resolve(new Promise(function (resolve, reject) {
      var req = request(options, function (res) {
        return new Promise(function ($return, $error) {
          var catchment, r, parsed, err;
          catchment = new Catchment();
          res.pipe(catchment);
          return Promise.resolve(catchment.promise).then(function ($await_2) {
            try {
              r = $await_2;

              if (res.headers['content-type'] === 'application/json') {
                try {
                  parsed = JSON.parse(r);
                  resolve(parsed);
                } catch (e) {
                  err = er(e);
                  err.postData = r;
                  reject(err);
                }
              } else {
                resolve(r);
              }

              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }.bind(this));
      }).on('error', function (error) {
        var err = er(error);
        reject(err);
      });

      if (data) {
        req.write(data);
      }

      req.end();
    })).then(function ($await_3) {
      try {
        result = $await_3;
        return $return(result);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

module.exports = rqt;