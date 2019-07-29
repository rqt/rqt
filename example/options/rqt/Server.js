import idioCore from '@idio/idio'
import { collect } from 'catchment'
import { parse } from 'querystring'

const Server = async () => {
  const { url } = await idioCore({
    async bodyparser(ctx, next) {
      const data = await collect(ctx.req)
      if (data) ctx.request.body = parse(data)
      await next()
    },
    test(ctx) {
      ctx.body = `You have requested with ${ctx.method}:
Body: ${JSON.stringify(ctx.request.body, null, 2)}
Headers: ${JSON.stringify(ctx.request.headers, null, 2)}
`
    },
  }, { port: 5001 })
  return url
}

export default Server