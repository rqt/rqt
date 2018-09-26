import { equal, ok, deepEqual } from 'zoroaster/assert'
import SessionServer from '../../context/SessionServer'
import Session from '../../../src/lib/Session'

/** @type {Object.<string, (c: SessionServer)} */
const ts = {
  context: SessionServer,
  async 'can persist session'({ SessionKey, url }) {
    // 0. Create a Session.
    const session = new Session({
      host: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 Node.js rqt',
      },
    })

    // 1. Request A JSON Page with Jqt.
    const { SessionKey: actual } = await session.jqt('/StartSession')
    equal(actual, SessionKey)

    // 2. Send Form Data And Get Headers With Aqt.
    const {
      statusCode,
      body,
      headers: { location },
    } = await session.aqt('/Login', {
      data: {
        LoginUserName: 'test',
        LoginPassword: 'test',
        sessionEncryptValue: SessionKey,
      },
      type: 'form',
    })
    equal(statusCode, 302)
    equal(body, 'Redirecting to <a href="/Portal">/Portal</a>.')
    equal(location, '/Portal')

    // 3. Request A Page As A String With Rqt.
    const res = await session.rqt(location)
    equal(res, 'Hello, test')

    // 4. Request A Page As A String With Bqt.
    const res2 = await session.bqt(location)
    ok(res2 instanceof Buffer)
    equal(`${res2}`, 'Hello, test')

    // 4. Request Status With Aqt.
    const { statusCode: sc, statusMessage: sm } = await session.aqt(location, {
      justHeaders: true,
    })
    deepEqual({ statusCode: sc, statusMessage: sm }, {
      statusCode: 200,
      statusMessage: 'OK',
    })
  },
}

export default ts