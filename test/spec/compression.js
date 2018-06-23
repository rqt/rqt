import { equal, deepEqual } from 'zoroaster/assert'
import IdioContext from '../context/idio'
import rqt from '../../src'

/** @type {Object.<string, (c: IdioContext)>} */
const T = {
  context: IdioContext,
  async 'works without decompression'({ start, getFixtureUrl, fixtureName, readFixture }) {
    await start()
    const url = getFixtureUrl(fixtureName)
    const res = await rqt(url)
    const expected = await readFixture()
    equal(res, expected)
  },
  async 'decompresses data'({ start, getFixtureUrl, fixtureName, readFixture }) {
    await start({
      middleware: {
        compress: { use: true },
      },
    })
    const url = getFixtureUrl(fixtureName)
    const res = await rqt(url, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    const expected = await readFixture()
    equal(res, expected)
  },
  async 'decompresses json data'({ start, getFixtureUrl, fixtureJsonName, readJsonFixture }) {
    await start({
      middleware: {
        compress: { use: true },
      },
    })
    const url = getFixtureUrl(fixtureJsonName)
    const res = await rqt(url, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    const expected = await readJsonFixture()
    deepEqual(res, expected)
  },

}

export default T
