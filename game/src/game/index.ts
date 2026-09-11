import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import decomp from 'poly-decomp'
import signaling, { type Initiator } from 'rkv-signaling'

import { Event, Colors, Channel } from 'common'
import * as ex from '../pixiEx'
import * as l1 from '../l1'
import Sound from './sound'
import leaderboard from './leaderboard'
import updateScoreIndicators from './updateScoreIndicators'
import http from './http'
import state from './state'
import stage from './stage'
import jump from './jump'
import brake from './brake'
import shake from './shake'
import scope from './scope'
import createPlayer from './player/create'
import removePlayer from './player/remove'
import playerRepository from './player/repository'
import qrCode from './qrCode'
import createProjectile from './projectile/create'
import cooldown from './cooldown'
import collider from './collider'
import debugLog from './debugLog'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PROJECTILE_COOLDOWN,
  SHAKE_COOLDOWN,
} from './constant'
import debugMatter from './util/debugMatter'
import setLapTime from './setLapTime'
import * as Color from './constant/color'

// Hack to make Matter.Bodies.fromVertices work
window.decomp = decomp

const DEBUG_MATTER = false

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'
const CONTROLLER_HOST = process.env.CONTROLLER_HOST || 'localhost:4001'

// Enable pixel perfect rendering
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const app = new PIXI.Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  antialias: true,
  // TODO: Enable when possible (background image exists)
  // clearBeforeRender: false,
  backgroundColor: ex.fromHex(Color.LIGHT_GRAY),
})
// Enables setting zIndex on the children of stage
app.stage.sortableChildren = true
state.pixiStage = app.stage

const gameElement = document.getElementById('game')

if (!gameElement) {
  throw new Error('Found no #game element to mount the canvas into')
}

gameElement.appendChild(app.view)

ex.init(app)

app.ticker.add(l1.update)

const engine = Matter.Engine.create()
state.matterWorld = engine.world

// Remove default gravity
state.matterWorld.gravity.y = 0

app.ticker.add(() => {
  Matter.Engine.update(engine)
})

Matter.Events.on(engine, 'collisionStart', collider)

app.loader.add('spritesheet/main.json')
app.loader.add('spritesheet/spritesheet.json')

Sound.MUSIC.play()

const onPlayerData = (id: string) => (message: { event: string, payload: never }) => {
  const { event, payload } = message

  switch (event) {
    case Event.ToGame.BRAKE:
      brake.start(id)
      break
    case Event.ToGame.JUMP:
      jump(id)
      brake.stop(id)
      break
    case Event.ToGame.SHAKE:
      cooldown(
        id,
        {
          id: 'shake',
          duration: SHAKE_COOLDOWN,
          ability: () => {
            shake(id)
          },
        },
      )
      break
    case Event.ToGame.DRAG:
      scope.aim(
        id,
        payload,
      )
      break
    case Event.ToGame.DRAG_END:
      scope.reset(id)
      cooldown(
        id,
        {
          id: 'projectile',
          duration: PROJECTILE_COOLDOWN,
          ability: () => {
            createProjectile(
              id,
              payload,
            )
          },
        },
      )
      break
    default:
      console.warn(`Unhandled event: ${event}`)
  }
}

const morePlayersAllowed = () => playerRepository.count() < Colors.length

const onPlayerJoin = ({
  id,
  setOnData,
  send,
  close,
}: Initiator) => {
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
  } = createPlayer(id)

  Sound.UI_04.play()

  updateScoreIndicators()

  send(Channel.RELIABLE, {
    event: Event.FromGame.YOU_JOINED,
    payload: {
      id,
      color: hex,
    },
  })
}

const onPlayerLeave = (id: string) => {
  removePlayer(id)
  updateScoreIndicators()
}

const createBot = (idSuffix = Date.now().toString()) => {
  onPlayerJoin({
    id: `BOT_${idSuffix}`,
    setOnData: () => {},
    send: debugLog,
    close: () => {},
  })
}

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

          stage(gameCode)
          leaderboard.renderFrame()
          createBot('DEFAULT')
        })
    })
  })
  .catch(() => {
    console.error('Unable to load font')
  })

if (DEBUG_MATTER) {
  const gfx = new PIXI.Graphics()
  gfx.zIndex = 10000
  app.stage.addChild(gfx)

  l1.repeat(() => {
    debugMatter(
      Matter.Composite.allBodies(engine.world),
      gfx,
      { color: ex.fromHex(Color.GREEN) },
    )
  })
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
  ex.resize(screenWidth, screenHeight)
}
resizeGame()
window.addEventListener('resize', resizeGame)

window.debug = {
  ...window.debug,
  // Add console commands here
  createBot,
  start,
  stop,
  state,
  logging: false,
  behaviors: () => l1.getAll().map(b => b.id),
  setLapTime,
}
