import { HTTPContext } from 'https-context'

export default class Context extends HTTPContext {
  constructor() {
    super()
  }

  get data() {
    return {
      hello: 'world',
      login: 'user',
      password: 123456,
    }
  }
}
