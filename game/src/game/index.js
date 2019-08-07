import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import signaling from 'rkv-signaling'
import { Event, Colors, Channel } from '../../../common'
import { GAME_HEIGHT, GAME_WIDTH } from './constant'
import http from './http'
import stage from './stage'
import jump from './jump'
import createPlayer from './player/create'
import removePlayer from './player/remove'
import playerRepository from './player/repository'

// Hack to make Matter.Bodies.fromVertices work
window.decomp = require('poly-decomp')

const DEBUG_MATTER = false

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'

// Enable pixel perfect rendering
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

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

// Arrow rendering directional command
let arrow
const arrowPosition = {
  x: 500,
  y: 300,
}

// Remove default gravity
engine.world.gravity.y = 0

app.ticker.add(() => {
  Matter.Engine.update(engine)
})

app.loader.add('spritesheet/fight.json')
app.loader.add('spritesheet/spritesheet.json')

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
      console.warn(`Unhandled event for message: ${message}`)
  }
}

const morePlayersAllowed = () => playerRepository.count() < Colors.length

const onPlayerJoin = ({
  id,
  setOnData,
  send,
  close,
}) => {
  if (!morePlayersAllowed()) {
    send(Channel.RELIABLE, { event: Event.FromGame.FULL })
    close()
    return
  }

  setOnData(onPlayerData(id))

  createPlayer(
    app.stage,
    engine.world,
    id,
  )

  send(Channel.RELIABLE, {
    event: Event.FromGame.YOU_JOINED,
    payload: { id },
  })
}

const onPlayerLeave = (id) => {
  removePlayer(
    engine.world,
    id,
  )
}

const createBot = (idSuffix = Date.now()) => {
  createPlayer(
    app.stage,
    engine.world,
    `BOT_${idSuffix}`,
  )
}

// Experimental API's are not supported by typescript
// @ts-ignore
document.fonts.load('10pt "patchy-robots"')
  .then(() => {
    app.loader.load(() => {
      http.createGame()
        .then(({ gameCode }) => {
          console.log(`[Game created] ${gameCode}`)

          signaling.runReceiver({
            wsAddress: WS_ADDRESS,
            receiverId: gameCode,
            onInitiatorJoin: onPlayerJoin,
            onInitiatorLeave: onPlayerLeave,
          })
        })

      createBot('DEFAULT')

      arrow = new PIXI.Sprite(l1.getTexture('arrow/arrow-green'))
      arrow.position = arrowPosition
      arrow.anchor.set(0.5)
      app.stage.addChild(arrow)

      stage({ world: engine.world, app })
    })
  })
  .catch(() => {
    console.error('Unable to load font')
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

const start = () => {
  app.ticker.start()
}

const stop = () => {
  app.ticker.stop()
}

window.debug = {
  ...window.debug,
  createBot,
  start,
  stop,
  // Add console commands here
}
