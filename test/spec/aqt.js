import { ok, equal } from 'zoroaster/assert'
import { aqt } from '../../src'
import { HTTPContext } from 'https-context'

/** @type {Object.<string, (c: HTTPContext)>} */
const T = {
  context: [HTTPContext],
  async 'returns body, headers and status'({ setResponse, url, setHeaders }) {
    const data = 'test-response'
    const header = 'hello-world'
    setHeaders({
      'x-test': header,
    })
    setResponse(data)
    const { body, headers, statusCode, statusMessage } = await aqt(url)
    equal(body, data)
    equal(statusCode, 200)
    equal(statusMessage, 'OK')
    ok(headers)
    equal(headers['x-test'], header)
  },
}

export default T