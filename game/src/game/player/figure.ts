import * as l2 from 'l2'
import * as PIXI from 'pixi.js'

const FRAMES = {
  astronaut: {
    side: {
      suit: ['astronaut-side-1-suit', 'astronaut-side-2-suit'],
      gear: ['astronaut-side-1-gear', 'astronaut-side-2-gear'],
    },
    front: {
      suit: ['astronaut-front-1-suit', 'astronaut-front-2-suit'],
      gear: ['astronaut-front-1-gear', 'astronaut-front-2-gear'],
    },
  },
  robot: {
    side: {
      suit: ['robot-side-1-suit', 'robot-side-2-suit'],
      gear: ['robot-side-1-gear', 'robot-side-2-gear'],
    },
    front: {
      suit: ['robot-front-1-suit', 'robot-front-2-suit'],
      gear: ['robot-front-1-gear', 'robot-front-2-gear'],
    },
  },
}

export type Figure = keyof typeof FRAMES

export type Pose = keyof typeof FRAMES[Figure]

const animate = (names: string[], animationSpeed: number) => {
  const sprite = new PIXI.AnimatedSprite(names.map(l2.getTexture))
  sprite.animationSpeed = animationSpeed
  sprite.play()
  return sprite
}

export default (figure: Figure, pose: Pose, hex: string, animationSpeed: number) => {
  const { suit, gear } = FRAMES[figure][pose]

  const suitSprite = animate(suit, animationSpeed)
  suitSprite.tint = hex

  const container = new PIXI.Container()
  container.addChild(suitSprite, animate(gear, animationSpeed))
  return container
}
