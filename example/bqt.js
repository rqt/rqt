import { HTTPContext } from 'https-context'
/* start example */
import { bqt } from '../src'

const Request = async (url) => {
  const res = await bqt(url)
  console.log(res)
}
/* end example */

(async () => {
  const c = new HTTPContext()
  await c._init()
  c.setResponse('Hello World')
  await Request(c.url)
  process.exit()
})()