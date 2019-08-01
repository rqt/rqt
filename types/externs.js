/**
 * @fileoverview
 * @externs
 */

/* typal types/session.xml externs */
/** @const */
var _rqt = {}
/**
 * @param {!_rqt.SessionOptions} options The options for the session.
 * @interface
 */
_rqt.Session = function(options) {}
/**
 * Cookies as an object.
 * @type {!Object}
 */
_rqt.Session.prototype.cookies
/**
 * Cookies as a header.
 * @type {string}
 */
_rqt.Session.prototype.Cookie
/**
 * Make a request and return the body.
 * @param {string} location The URL to which to make a request.
 * @param {!_rqt.AqtOptions} options Options for requests.
 * @return {!Promise<string>}
 */
_rqt.Session.prototype.rqt = function(location, options) {}
/**
 * Make a request and return the body as buffer.
 * @param {string} location The URL to which to make a request.
 * @param {!_rqt.AqtOptions} options Options for requests.
 * @return {!Promise<!Buffer>}
 */
_rqt.Session.prototype.bqt = function(location, options) {}
/**
 * Make a request and return the parsed JSON body as an object.
 * @param {string} location The URL to which to make a request.
 * @param {!_rqt.AqtOptions} options Options for requests.
 * @return {!Promise<!Object>}
 */
_rqt.Session.prototype.jqt = function(location, options) {}
/**
 * Make a request and return the body, headers and status.
 * @param {string} location The URL to which to make a request.
 * @param {!_rqt.AqtOptions} options Options for requests.
 * @return {!Promise<!_rqt.AqtReturn>}
 */
_rqt.Session.prototype.aqt = function(location, options) {}

/* typal types/SessionOptions.xml externs */
/**
 * Options for a session.
 * @record
 */
_rqt.SessionOptions
/**
 * The prefix to each request, such as `https://rqt.biz`.
 * @type {string|undefined}
 */
_rqt.SessionOptions.prototype.host
/**
 * Headers to use for each request.
 * @type {(!http.OutgoingHttpHeaders)|undefined}
 */
_rqt.SessionOptions.prototype.headers
