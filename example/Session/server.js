import idioCore from '@idio/core'

const Server = async () => {
  const { url, app, router } = await idioCore({
    /** @type {import('koa').Middleware} */
    async error(ctx, next) {
      try {
        await next()
      } catch ({ message }) {
        ctx.status = 400
        ctx.body = message
      }
    },
    session: { use: true, keys: ['example'] },
    bodyparser: { use: true },
  }, { port: 5002 })
  router.get('/StartSession', async (ctx, next) => {
    ctx.session.SessionKey = 'Example-4736gst4yd'
    ctx.body = {
      SessionKey: ctx.session.SessionKey,
    }
    await next()
  })
  router.post('/Login', async (ctx, next) => {
    const { sessionEncryptValue } = ctx.request.body
    if (!sessionEncryptValue) {
      throw new Error('Missing session key.')
    }
    if (sessionEncryptValue != ctx.session.SessionKey) {
      throw new Error('Incorrect session key.')
    }
    ctx.session.user = ctx.request.body.LoginUserName
    ctx.redirect('/Portal')
    await next()
  })
  router.get('/Portal', async (ctx, next) => {
    if (!ctx.session.user) {
      throw new Error('Not authorized.')
    }
    ctx.body = `Hello, ${ctx.session.user}`
    await next()
  })
  app.use(router.routes())
  return url
}

export default Server