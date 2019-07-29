import idioCore from '@idio/idio'
import { collect } from 'catchment'
import { parse } from 'querystring'

const Server = async () => {
  const { url, app } = await idioCore({
    async error(ctx, next) {
      try {
        await next()
      } catch ({ message }) {
        ctx.status = 400
        ctx.body = message
      }
    },
    session: { use: true, keys: ['example'] },
    async bodyparser(ctx, next) {
      const data = await collect(ctx.req)
      if (data) ctx.request.body = parse(data)
      await next()
    },
  }, { port: 5002 })
  app.use((ctx) => {
    switch (ctx.path) {
    case '/StartSession':
      ctx.session.SessionKey = 'Example-4736gst4yd'
      ctx.body = {
        SessionKey: ctx.session.SessionKey,
      }
      break
    case '/Login': {
      const { sessionEncryptValue } = ctx.request.body
      if (!sessionEncryptValue) {
        throw new Error('Missing session key.')
      }
      if (sessionEncryptValue != ctx.session.SessionKey) {
        throw new Error('Incorrect session key.')
      }
      ctx.session.user = ctx.request.body.LoginUserName
      ctx.redirect('/Portal')
      break
    }
    case '/Portal':
      if (!ctx.session.user) {
        throw new Error('Not authorized.')
      }
      ctx.body = `Hello, ${ctx.session.user}`
      break
    }
  })
  return url
}

export default Server