import { deepEqual, ok } from '@zoroaster/assert'
import { bqt } from '../../src'
import { HTTPContext } from 'https-context'

/** @type {Object.<string, (c: HTTPContext)>} */
const T = {
  context: HTTPContext,
  async 'returns binary data'({ url, setResponse }) {
    const d = 'test buffer'
    setResponse(d)
    const expected = new Buffer(d)
    const res = await bqt(url)
    ok(res instanceof Buffer)
    deepEqual(res, expected)
  },
}

export default T