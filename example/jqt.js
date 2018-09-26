import idioCore from '@idio/core'
/* start example */
import { jqt } from '../src'

const Request = async (url) => {
  const res = await jqt(url)
  console.log(JSON.stringify(res, null, 2))
}
/* end example */

(async () => {
  const { url } = await idioCore({
    bodyparser: { use: true },
    async test(ctx, next) {
      ctx.body = {
        Hello: 'World',
      }
      await next()
    },
  }, { port: 5001 })
  await Request(url)
  process.exit()
})()