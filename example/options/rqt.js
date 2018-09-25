import idioCore from '@idio/core'
/* start example */
import rqt from '../../src'

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
  const { url } = await idioCore({
    bodyparser: { use: true },
    async test(ctx, next) {
      ctx.body = JSON.stringify({
        res: 'You have requested:',
        body: ctx.request.body,
        method: ctx.method,
        headers: ctx.request.headers,
      }, null, 2)
      await next()
    },
  }, { port: 5001 })
  await Request(url)
  process.exit()
})()