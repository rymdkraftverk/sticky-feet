import * as l2 from 'l2'
import * as PIXI from 'pixi.js'

const FRAMES = {
  side: {
    rim: ['astronaut-side-1-rim', 'astronaut-side-2-rim'],
    suit: ['astronaut-side-1-suit', 'astronaut-side-2-suit'],
    gear: ['astronaut-side-1-gear', 'astronaut-side-2-gear'],
  },
  front: {
    rim: ['astronaut-front-1-rim', 'astronaut-front-2-rim'],
    suit: ['astronaut-front-1-suit', 'astronaut-front-2-suit'],
    gear: ['astronaut-front-1-gear', 'astronaut-front-2-gear'],
  },
}

export type Pose = keyof typeof FRAMES

const animate = (names: string[], animationSpeed: number) => {
  const sprite = new PIXI.AnimatedSprite(names.map(l2.getTexture))
  sprite.animationSpeed = animationSpeed
  sprite.play()
  return sprite
}

export default (pose: Pose, hex: string, animationSpeed: number) => {
  const { rim, suit, gear } = FRAMES[pose]

  const suitSprite = animate(suit, animationSpeed)
  suitSprite.tint = hex

  const figure = new PIXI.Container()
  figure.addChild(animate(rim, animationSpeed), suitSprite, animate(gear, animationSpeed))
  return figure
}
