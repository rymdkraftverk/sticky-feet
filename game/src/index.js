import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import http from './http'
import signaling from 'rkv-signaling'
import { Event, Channel } from 'common'

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'
const VERSION = process.env.VERSION || 'N/A'

const { error, log, warn } = console

log(`Version: ${VERSION}`)

const app = new PIXI.Application({
  width:             1280,
  height:            720,
  antialias:         true,
  clearBeforeRender: false,
})

document
  .getElementById('game')
  .appendChild(app.view)

l1.init(app, {
  debug:   false,
  logging: false,
})

const engine = Matter.Engine.create();
const boxA = Matter.Bodies.rectangle(100, 100, 80, 80);
// engine.world.gravity.y = 1
Matter.World.add(engine.world, [boxA]);

app.ticker.add(() => {
  Matter.Engine.update(engine)
})

app.loader.add('spritesheet/spritesheet.json')

export const onPlayerJoin = ({
  id,
  setOnData,
  send,
  close,
}) => {
  send(Channel.RELIABLE, {
    event:   Event.YOU_JOINED,
    payload: { id },
  })
}

// Experimental API's are not supported by typescript
// @ts-ignore
document.fonts.load('10pt "patchy-robots"')
  .then(() => {
    app.loader.load(() => {
      http.createGame()
        .then(({ gameCode }) => {
          log(`[Game created] ${gameCode}`)

          signaling.runReceiver({
            wsAddress:        WS_ADDRESS,
            receiverId:       gameCode,
            onInitiatorJoin:  onPlayerJoin,
            onInitiatorLeave: console.log,
          })
        })

        const sprite = new PIXI.Sprite(l1.getTexture('powerup/powerup-ghost'))
        app.stage.addChild(sprite)
        l1.addBehavior({ onUpdate: () => {
          sprite.position.x = boxA.position.x
          sprite.position.y = boxA.position.y
        }})

    })
  })
  .catch(() => {
    error('Unable to load font')
  })
