const { _rqt, _aqt, _jqt, _bqt, _Session } = require('./rqt')

/**
 * An instance of a session class can maintain cookies.
 */
class Session extends _Session {
  /**
   * @fnType {_rqt.Session.constructor}
   */
  constructor(options) {
    super(options)
    /**
     * @fnType {_rqt.Session.cookies}
     */
    this.cookies = this.cookies
  }
  /**
   * @fnType {_rqt.Session.aqt}
   */
  aqt(location, options) {
    return super.aqt(location, options)
  }
  /**
   * @fnType {_rqt.Session.rqt}
   */
  rqt(location, options) {
    return super.rqt(location, options)
  }
  /**
   * @fnType {_rqt.Session.jqt}
   */
  jqt(location, options) {
    return super.jqt(location, options)
  }
  /**
   * @fnType {_rqt.Session.bqt}
   */
  bqt(location, options) {
    return super.bqt(location, options)
  }
  /**
   * @fnType {_rqt.Session.Cookie}
   */
  get Cookie() {
    return super.Cookie
  }
}

/**
 * @fnType {_rqt.Session.rqt}
 */
function rqt(location, options) {
  return _rqt(location, options)
}
/**
 * @fnType {_rqt.Session.bqt}
 */
function bqt(location, options) {
  return _bqt(location, options)
}
/**
 * @fnType {_rqt.Session.jqt}
 */
function jqt(location, options) {
  return _jqt(location, options)
}
/**
 * @fnType {_rqt.Session.aqt}
 */
function aqt(location, options) {
  return _aqt(location, options)
}

module.exports = rqt
module.exports.aqt = aqt
module.exports.jqt = jqt
module.exports.bqt = bqt
module.exports.Session = Session

/* typal types/SessionOptions.xml closure noSuppress */
/**
 * @typedef {_rqt.SessionOptions} SessionOptions `＠record` Options for a session.
 */
/**
 * @typedef {Object} _rqt.SessionOptions `＠record` Options for a session.
 * @prop {string} [host] The prefix to each request, such as `https://rqt.biz`.
 * @prop {!http.OutgoingHttpHeaders} [headers] Headers to use for each request.
 */

/* typal node_modules/@rqt/aqt/types/return.xml closure noSuppress */
/**
 * @typedef {_rqt.AqtReturn} AqtReturn The return type of the function.
 */
/**
 * @typedef {Object} _rqt.AqtReturn The return type of the function.
 * @prop {!(string|Object|Buffer)} body The return from the server. In case the `json` content-type was set by the server, the response will be parsed into an object. If `binary` option was used for the request, a `Buffer` will be returned. Otherwise, a string response is returned.
 * @prop {!http.IncomingHttpHeaders} headers Incoming headers returned by the server.
 * @prop {number} statusCode The status code returned by the server.
 * @prop {string} statusMessage The status message set by the server.
 */
/**
 * @typedef {import('http').IncomingHttpHeaders} http.IncomingHttpHeaders
 */

/* typal node_modules/@rqt/aqt/types/index.xml closure noSuppress */
/**
 * @typedef {_rqt.AqtOptions} AqtOptions Configuration for requests.
 */
/**
 * @typedef {Object} _rqt.AqtOptions Configuration for requests.
 * @prop {!Object} [data] Optional data to send to the server with the request.
 * @prop {string} [type="json"] How to send data: `json` to serialise JSON data and add _Content-Type: application/json_ header, and `form` for url-encoded transmission with _Content-Type: application/x-www-form-urlencoded_. _Multipart/form-data_ must be implemented manually. Default `json`.
 * @prop {!http.OutgoingHttpHeaders} [headers] Headers to use for the request. By default, a single User-Agent header with _Mozilla/5.0 (Node.JS) aqt/{version}_ value is set.
 * @prop {boolean} [compress=true] Add the `Accept-Encoding: gzip, deflate` header to indicate to the server that it can send a compressed response. Default `true`.
 * @prop {number} [timeout] The timeout after which the request should fail.
 * @prop {string} [method] What HTTP method to use in making of the request. When no method is given and `data` is present, defaults to `POST`.
 * @prop {boolean} [binary=false] Whether to return a buffer instead of a string. Default `false`.
 * @prop {boolean} [justHeaders=false] Whether to stop the request after response headers were received, without waiting for the data. Default `false`.
 */
/**
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 */
