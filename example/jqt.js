import idioCore from '@idio/idio'
import { collect } from 'catchment'
import { parse } from 'querystring'

/* start example */
import { jqt } from '../src'

const Request = async (url) => {
  const res = await jqt(url)
  console.log(JSON.stringify(res, null, 2))
}
/* end example */

(async () => {
  const { url } = await idioCore({
    async bodyparser(ctx, next) {
      const data = await collect(ctx.req)
      if (data) ctx.request.body = parse(data)
      await next()
    },
    test(ctx) {
      ctx.body = {
        Hello: 'World',
      }
    },
  }, { port: 5001 })
  await Request(url)
  process.exit()
})()