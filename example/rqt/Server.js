import idioCore from '@idio/core'

const Server = async () => {
  const { url } = await idioCore({
    /** @type {import('koa').Middleware} */
    async hello(ctx, next) {
      ctx.body = 'Hello World'
      await next()
    },
  }, { port: 0 })
  return url
}

export default Server