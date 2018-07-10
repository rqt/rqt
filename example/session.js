import { Session } from '../src'

const USER_AGENT = 'Mozilla/5.0 Node.js rqt'

;(async () => {
  const session = new Session({
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const { SessionKey } = await session.request('http://127.0.0.1/Session.ashx')

  const { body, headers } = await session.request('http://127.0.0.1/Login.aspx', {
    data: {
      LoginUserName: 'test',
      LoginPassword: 'test',
      sessionEncryptValue: SessionKey,
    },
    type: 'form',
    returnHeaders: true,
  })
})()
