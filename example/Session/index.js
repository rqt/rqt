import Server from './server'
/* start example */
import { Session } from '../../src'

const SessionRequest = async (url) => {
  // 0. Create a Session.
  const session = new Session({
    host: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 Node.js rqt',
    },
  })

  // 1. Request A JSON Page with Jqt.
  const { SessionKey } = await session.jqt('/StartSession')
  console.log('Session key: %s', SessionKey)

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
  console.log('%s Redirect: "%s"', statusCode, body)

  // 3. Request A Page As A String With Rqt.
  const res = await session.rqt(location)
  console.log('Page: "%s"', res)
}
/* end example */

(async () => {
  const url = await Server()
  await SessionRequest(url)
  process.exit()
})()