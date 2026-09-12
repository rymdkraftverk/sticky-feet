import type * as PIXI from 'pixi.js'
import type * as Matter from 'matter-js'

export type Color = { name: string, hex: string }

export type Scope = PIXI.Sprite & { distance?: number }

export type Player = {
  behaviors: Record<string, string>
  body: Matter.Body
  braking: boolean
  color: Color
  cooldowns: Record<string, boolean>
  grounded: boolean
  id: string
  jumpPower: number
  scope: Scope
  score: number
  slows: number
  sprite: PIXI.AnimatedSprite
}

export type Projectile = {
  behaviors: Record<string, string>
  body: Matter.Body
  firedBy: string
  id: string
  sprite: PIXI.AnimatedSprite
}

export type Entity = {
  behaviors: Record<string, string>
  body: Matter.Body
  id: string
  sprite: PIXI.Container & { destroy: () => void }
}
