import idioCore from '@idio/idio'

const Server = async () => {
  const { url } = await idioCore({
    async hello(ctx) {
      ctx.body = 'Hello World'
    },
  }, { port: 0 })
  return url
}

export default Server