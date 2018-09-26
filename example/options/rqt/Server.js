import idioCore from '@idio/core'

const Server = async () => {
  const { url } = await idioCore({
    bodyparser: { use: true },
    /** @type {import('koa').Middleware} */
    async test(ctx, next) {
      ctx.body = `You have requested with ${ctx.method}:
Body: ${JSON.stringify(ctx.request.body, null, 2)}
Headers: ${JSON.stringify(ctx.request.headers, null, 2)}
`
      await next()
    },
  }, { port: 5001 })
  return url
}

export default Server