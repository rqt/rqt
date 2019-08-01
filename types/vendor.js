/**
 * @fileoverview
 * @externs
 */

/* typal node_modules/@rqt/aqt/types/index.xml externs */
/** @const */
var _rqt = {}
/**
 * Configuration for requests.
 * @typedef {{ data: ((!Object)|undefined), type: (string|undefined), headers: ((!http.OutgoingHttpHeaders)|undefined), compress: (boolean|undefined), timeout: (number|undefined), method: (string|undefined), binary: (boolean|undefined), justHeaders: (boolean|undefined) }}
 */
_rqt.AqtOptions

/* typal node_modules/@rqt/aqt/types/return.xml externs */
/**
 * The return type of the function.
 * @typedef {{ body: !(string|Object|Buffer), headers: !http.IncomingHttpHeaders, statusCode: number, statusMessage: string }}
 */
_rqt.AqtReturn
