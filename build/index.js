"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rqt;
Object.defineProperty(exports, "Session", {
  enumerable: true,
  get: function () {
    return _session.default;
  }
});

var _http = require("http");

var _https = require("https");

var _catchment = _interopRequireDefault(require("catchment"));

var _url = require("url");

var _erotic = _interopRequireDefault(require("erotic"));

var _lib = require("./lib");

var _package = require("../package.json");

var _session = _interopRequireDefault(require("./session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Request an HTTP page. If `returnHeaders` is set to true, an object will be returned.
 * @param {string} address Url such as http://example.com/api
 * @param {Config} [config] Configuration object
 * @param {object} [config.data] Data to send to the server using a post request.
 * @param {object} [config.headers] A map of headers to use in the request.
 * @param {boolean} [config.binary] Whether to return a buffer. Default false.
 * @param {boolean} [config.returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
 * @param {'form'|'json'} [config.type=json] How to send data: `form` for url-encoded transmission and `json` to serialise JSON data. `json` mode by default.
 * @param {string} [config.method] What method to use to send data (only works when `data` is set). Default `POST`.
 * @returns {Promise.<string|Buffer|{ body: string|Buffer, headers: Object.<string, string> }>} A string or buffer as a response. If `config.headers` was set, an object is returned.
 */
async function rqt(address, config = {}) {
  const {
    data,
    type = 'json',
    headers = {
      'User-Agent': `Mozilla/5.0 (Node.js) rqt/${_package.version}`
    },
    binary = false,
    returnHeaders = false,
    method = 'POST'
  } = config;
  const er = (0, _erotic.default)(true);
  const {
    hostname,
    protocol,
    port,
    path
  } = (0, _url.parse)(address);
  const isHttps = protocol === 'https:';
  const request = isHttps ? _https.request : _http.request;
  const options = {
    hostname,
    port,
    path,
    headers
  };
  let d = data;

  if (d) {
    let contentType;

    switch (type) {
      case 'json':
        d = JSON.stringify(data);
        contentType = 'application/json';
        break;

      case 'form':
        d = (0, _lib.getFormData)(data);
        contentType = 'application/x-www-form-urlencoded';
        break;
    }

    options.method = method;
    options.headers['Content-Type'] = contentType;
    options.headers['Content-Length'] = Buffer.byteLength(d);
  }

  let h;
  const body = await new Promise((resolve, reject) => {
    const req = request(options, async rs => {
      ({
        headers: h
      } = rs);
      const {
        promise
      } = new _catchment.default({
        rs,
        binary
      });
      const response = await promise;

      if (h['content-type'].startsWith('application/json')) {
        try {
          const parsed = JSON.parse(response);
          resolve(parsed);
        } catch (e) {
          const err = er(e);
          err.response = response;
          reject(err);
        }
      } else {
        resolve(response);
      }
    }).on('error', error => {
      const err = er(error);
      reject(err);
    });

    if (d) {
      req.write(d);
    }

    req.end();
  });
  if (returnHeaders) return {
    body,
    headers: h
  };
  return body;
}
/**
 * @typedef {Object} Config
 * @property {object} [data] Data to send to the server.
 * @property {object} [headers] A map of headers.
 * @property {boolean} [binary] Whether to return a buffer.
 * @property {boolean} [returnHeaders] Return an object with `body` and `headers` properties instead of just the response.
 * @property {'form'|'json'} [type] How to send data: `form` for url-encoded transmission and `json` to serialise JSON data.
 * @param {string} [method=POST] What method to use to send data (only works when `data` is set). Default `POST`.
 */
//# sourceMappingURL=index.js.map