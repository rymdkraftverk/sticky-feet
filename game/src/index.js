import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import signaling from 'rkv-signaling'
import { Event, Channel } from '../../common'
import { GAME_HEIGHT, GAME_WIDTH } from '/constant'
import http from './http'
import stage from './stage'

// Hack to make Matter.Bodies.fromVertices work
window.decomp = require('poly-decomp')

const DEBUG_MATTER = false

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'
const VERSION = process.env.VERSION || 'N/A'

const { error, log, warn } = console

log(`Version: ${VERSION}`)

const app = new PIXI.Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  antialias: true,
  // TODO: Enable when possible (background image exists)
  // clearBeforeRender: false,
  backgroundColor: 0x000077,
})

document
  .getElementById('game')
  .appendChild(app.view)

l1.init(app, {
  debug: false,
  logging: false,
})

const engine = Matter.Engine.create()
const boxA = Matter.Bodies.rectangle(700, 400, 80, 80)

// Arrow rendering directional command
let arrow
const arrowPosition = {
  x: 500,
  y: 300,
}

// engine.world.gravity.y = 1
Matter.World.add(engine.world, [boxA])

app.ticker.add(() => {
  Matter.Engine.update(engine)
})

app.loader.add('spritesheet/lizard.json')
app.loader.add('spritesheet/spritesheet.json')

const jump = (id) => {
  log(`Player ${id} jumps!`)

  Matter.Body.applyForce(
    boxA,
    {
      x: boxA.position.x,
      y: boxA.position.y,
    },
    {
      x: 0,
      y: -0.2,
    },
  )
}

const vectorTip = ({ x: originX, y: originY }, angle, distance) => ({
  x: originX + distance * Math.cos(angle),
  y: originY + distance * Math.sin(angle),
})

const onPlayerData = id => (message) => {
  const { event, payload } = message

  switch (event) {
    case Event.ToGame.JUMP:
      jump(id)
      break
    case Event.ToGame.DRAG:
      arrow.rotation = payload.angle
      arrow.position = vectorTip(
        arrowPosition,
        payload.angle,
        payload.distance,
      )
      break
    case Event.ToGame.DRAG_END:
      arrow.position = arrowPosition
      break
    default:
      warn(`Unhandled event for message: ${message}`)
  }
}

const onPlayerJoin = ({
  id,
  setOnData,
  send,
  // close,
}) => {
  setOnData(onPlayerData(id))

  send(Channel.RELIABLE, {
    event: Event.FromGame.YOU_JOINED,
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
            wsAddress: WS_ADDRESS,
            receiverId: gameCode,
            onInitiatorJoin: onPlayerJoin,
            onInitiatorLeave: log,
          })
        })
      const lizard = new PIXI.AnimatedSprite(['lizard-0', 'lizard-12'].map(l1.getTexture))
      lizard.scale.set(3)
      lizard.animationSpeed = 0.02
      lizard.play()
      app.stage.addChild(lizard)
      l1.addBehavior({
        onUpdate: () => {
          lizard.position.x = boxA.position.x
          lizard.position.y = boxA.position.y
        },
      })

      arrow = new PIXI.Sprite(l1.getTexture('arrow/arrow-green'))
      arrow.position = arrowPosition
      arrow.anchor.set(0.5)
      app.stage.addChild(arrow)

      stage({ world: engine.world })
    })
  })
  .catch(() => {
    error('Unable to load font')
  })

if (DEBUG_MATTER) {
  const matterRenderer = Matter.Render.create({
    element: document.getElementById('matter'),
    engine,
    options: {
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
  })
  Matter.Render.run(matterRenderer)
}

window.debug = {
  ...window.debug,
  // Add console commands here
}
