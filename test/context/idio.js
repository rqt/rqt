import { read } from 'wrote'
import { resolve } from 'path'
import idio from 'idio'

const FIXTURE = resolve(__dirname, '../fixture')

export default class IdioContext {
  async _init() {

  }
  async start(config = {}) {
    const mw = config.middleware || {}
    const middleware = {
      ...mw,
      static: { use: true, root: FIXTURE },
    }
    const res = await idio({
      port: 0,
      ...config,
      middleware,
    })

    const { url, app } = res
    this.app = app
    this.url = url
    return res
  }
  get fixtureName() {
    return 'chapter1.txt'
  }

  getFixtureUrl(fixture) {
    return `${this.url}/${fixture}`
  }
  async _destroy () {
    if (this.app) await this.app.destroy()
  }
  get fixturePath() {
    return resolve(FIXTURE, this.fixtureName)
  }
  async readFixture() {
    Dracula = read(this.fixturePath)
    const dracula = await Dracula
    return dracula
  }
}

let Dracula
