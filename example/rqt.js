import { HTTPContext } from 'https-context'
import rqt from '../src'

(async () => {
  let c
  try {
    c = new HTTPContext()
    await c._init()
    c.setResponse('Hello World')
    const res = await rqt(c.url)
    console.log(res)
  } finally {
    await c._destroy()
  }
})()
