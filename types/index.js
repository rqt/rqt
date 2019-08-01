export {}
/* typal types/session.xml closure noSuppress */
/**
 * @typedef {_rqt.SessionOptions} SessionOptions `＠record` Options for a session.
 */
/**
 * @typedef {Object} _rqt.SessionOptions `＠record` Options for a session.
 * @prop {string} [host] The prefix to each request, such as `https://rqt.biz`.
 * @prop {!http.OutgoingHttpHeaders} [headers] Headers to use for each request.
 */
/**
 * @typedef {_rqt.Session} Session `＠interface`
 */
/**
 * @typedef {Object} _rqt.Session `＠interface`
 * @prop {!Object} cookies Cookies as an object.
 * @prop {string} Cookie Cookies as a header.
 * @prop {function(string,!_rqt.AqtOptions): !Promise<string>} rqt Make a request and return the body.
 * @prop {function(string,!_rqt.AqtOptions): !Promise<!Buffer>} bqt Make a request and return the body as buffer.
 * @prop {function(string,!_rqt.AqtOptions): !Promise<!Object>} jqt Make a request and return the parsed JSON body as an object.
 * @prop {function(string,!_rqt.AqtOptions): !Promise<string>} aqt Make a request and return the body, headers and status.
 */
/**
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 */
/**
 * @typedef {import('http').IncomingHttpHeaders} http.IncomingHttpHeaders
 */
