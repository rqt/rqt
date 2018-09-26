import Server from './Server'
/* start example */
import rqt from '../../../src'

const Request = async (url) => {
  const res = await rqt(url, {
    headers: {
      'User-Agent': '@rqt/rqt (Node.js)',
    },
    data: {
      username: 'new-user',
      password: 'pass123',
    },
    type: 'form',
    method: 'PUT',
  })
  console.log(res)
}
/* end example */

(async () => {
  const url = await Server()
  await Request(url)
  process.exit()
})()