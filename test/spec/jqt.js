import { ok, deepEqual, throws } from 'zoroaster/assert'
import { jqt } from '../../src'
import { HTTPContext } from 'https-context'

const Data = {
  test: true,
  user: 'test',
  pass: 'zoroaster',
}

/** @type {Object.<string, (c: HTTPContext, cc: Data)>} */
const T = {
  context: [HTTPContext, Data],
  async 'parses body with jqt'(
    { url, setResponse, setContentType, getState }, data,
  ) {
    setContentType('application/json')
    setResponse(JSON.stringify(data))
    const res = await jqt(url)
    const { called } = getState()
    ok(called)
    deepEqual(res, data)
  },
  async 'parses json data with charset'(
    { url, setResponse, setContentType, getState }, data,
  ) {
    setContentType('application/json; charset=utf8')
    setResponse(JSON.stringify(data))
    const res = await jqt(url)
    const { called } = getState()
    ok(called)
    deepEqual(res, data)
  },
  async 'rejects when cannot parse json data'(
    { url, setContentType, setResponse },
  ) {
    const data = 'not-json-data'
    setContentType('application/json')
    setResponse(data)
    await throws({
      fn: jqt,
      args: url,
      response: data,
      message: /Unexpected token o/,
      stack: / at rejects when cannot parse json data/,
    })
  },
}

export default T