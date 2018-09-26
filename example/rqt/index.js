import Server from './Server'
/* start example */
import rqt from '../../src'

const Request = async (url) => {
  const res = await rqt(url)
  console.log(res)
}
/* end example */

(async () => {
  const url = await Server()
  await Request(url)
  process.exit()
})()