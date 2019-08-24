// There's a bug in typescript flagging this as an error.
// TODO: Remove ts-ignore once typescript is updated
// @ts-ignore
import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import signaling from 'rkv-signaling'
import { Event, Colors, Channel } from '../../../common'
import { GAME_HEIGHT, GAME_WIDTH } from './constant'
import http from './http'
import stage from './stage'
import jump from './jump'
import scope from './scope'
import createPlayer from './player/create'
import removePlayer from './player/remove'
import playerRepository from './player/repository'
import qrCode from './qrCode'

// Hack to make Matter.Bodies.fromVertices work
// @ts-ignore
window.decomp = require('poly-decomp')

const DEBUG_MATTER = false

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'
const CONTROLLER_HOST = process.env.CONTROLLER_HOST || 'localhost:4001'

// Enable pixel perfect rendering
// There's a bug in typescript flagging this as an error.
// TODO: Remove ts-ignore once typescript is updated
// @ts-ignore
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// There's a bug in typescript flagging this as an error.
// TODO: Remove ts-ignore once typescript is updated
// @ts-ignore
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

// Remove default gravity
engine.world.gravity.y = 0

app.ticker.add(() => {
  Matter.Engine.update(engine)
})

app.loader.add('spritesheet/fight.json')
app.loader.add('spritesheet/spritesheet.json')

const onPlayerData = id => (message) => {
  const { event, payload } = message

  switch (event) {
    case Event.ToGame.JUMP:
      jump(id)
      break
    case Event.ToGame.DRAG:
      scope.aim(
        id,
        payload,
      )
      break
    case Event.ToGame.DRAG_END:
      scope.reset(id)
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

  const {
    color: {
      hex,
    },
  } = createPlayer(
    app.stage,
    engine.world,
    id,
  )

  send(Channel.RELIABLE, {
    event: Event.FromGame.YOU_JOINED,
    payload: {
      id,
      color: hex,
    },
  })
}

const onPlayerLeave = (id) => {
  removePlayer(
    engine.world,
    id,
  )
}

const createBot = (idSuffix = Date.now().toString()) => {
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

          qrCode.display(CONTROLLER_HOST, gameCode)
        })

      createBot('DEFAULT')

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

const resizeGame = () => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  l1.resize(screenWidth, screenHeight)
}
resizeGame()
window.addEventListener('resize', resizeGame)

// debug is not a part of the window type
// @ts-ignore
window.debug = {
  // @ts-ignore
  ...window.debug,
  // Add console commands here
  createBot,
  start,
  stop,
}
