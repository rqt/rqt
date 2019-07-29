import read from '@wrote/read'
import { join } from 'path'
import idio from '@idio/idio'

const FIXTURE = join(__dirname, '../fixture')

export default class IdioContext {
  /**
   * @param {import('@idio/idio').MiddlewareConfig} middleware
   */
  async start(middleware = {}) {
    const { url, app } = await idio({
      ...middleware,
      static: { use: true, root: FIXTURE },
    }, {
      port: 0,
    })

    this.app = app
    this.url = url
  }
  get fixtureName() {
    return 'chapter1.txt'
  }
  get fixtureJsonName() {
    return 'chapter1.json'
  }

  getFixtureUrl(fixture) {
    return `${this.url}/${fixture}`
  }
  async _destroy () {
    if (this.app) await this.app.destroy()
  }
  get fixturePath() {
    return join(FIXTURE, this.fixtureName)
  }
  get fixtureJsonPath() {
    return join(FIXTURE, this.fixtureJsonName)
  }
  async readFixture() {
    Dracula = Dracula || read(this.fixturePath)
    const dracula = await Dracula
    return dracula
  }
  async readJsonFixture() {
    DraculaJson = DraculaJson || read(this.fixtureJsonPath)
    const dracula = await DraculaJson
    return JSON.parse(dracula)
  }
}

let Dracula
let DraculaJson