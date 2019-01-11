import idioCore from '@idio/core'

const Server = async (SessionKey) => {
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
  }, { port: 0 })
  router.get('/StartSession', async (ctx, next) => {
    ctx.session.SessionKey = SessionKey
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
  return { url, app }
}

export default class SessionServer {
  async _init() {
    const { app, url } = await Server(this.SessionKey)
    this._app = app
    this._url = url
  }
  get SessionKey() {
    return 'Example-4736gst4yd'
  }
  get url() {
    return this._url
  }
  async _destroy() {
    await this._app.destroy()
  }
}