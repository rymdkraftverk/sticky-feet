import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import * as l2 from 'l2'

import state from '../state'
import * as entity from '../entity'
import { enforceRunning } from '../autorun'
import { enforceBorder } from '../borderPatrol'
import powerupRepository from './repository'
import reverse from './reverse'
import { add, fromPolar } from '../linearAlgebra'
import {
  DOME_CENTER,
  MAX_POWERUPS,
  POWERUP_ORBIT_RADIUS,
  POWERUPS_PER_SECOND,
  TICKS_PER_SEC,
} from '../constant'
import type { Powerup } from '../types'

const KINDS = [reverse]

export const BODY_RADIUS = 22

const randomElement = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)]

const orbit = (id: string) => {
  const { body } = powerupRepository.find(id)
  const behaviorId = `powerup_orbit_${id}`

  l2.repeat(() => {
    Matter.Body.setVelocity(body, enforceRunning(
      DOME_CENTER,
      -state.lapTime,
      body.position,
      body.velocity,
    ))

    const { position, velocity } = enforceBorder(POWERUP_ORBIT_RADIUS, DOME_CENTER, body)
    Matter.Body.setVelocity(body, velocity)
    Matter.Body.setPosition(body, position)
  }, 1, { id: behaviorId })
  return behaviorId
}

export const create = ({ texture, onPickup }: typeof reverse) => {
  const { x, y } = add(
    DOME_CENTER,
    fromPolar(Math.random() * 2 * Math.PI, POWERUP_ORBIT_RADIUS),
  )

  const sprite = new PIXI.Sprite(l2.getTexture(texture))
  sprite.anchor.set(0.5)
  sprite.position.set(x, y)

  const body = Matter.Bodies.circle(x, y, BODY_RADIUS, {
    friction: 0,
    isSensor: true,
  })
  body.entityType = 'powerup'

  const powerup: Powerup = {
    behaviors: {},
    id: `powerup-${Math.random()}`,
    sprite,
    body,
    onPickup,
  }

  entity.add(powerup)
  powerupRepository.add(powerup)

  powerup.behaviors = {
    orbitId: orbit(powerup.id),
  }

  return powerup
}

export const activate = (powerup: Powerup) => {
  powerupRepository.remove(powerup.id)
  entity.remove(powerup)
  powerup.onPickup()
}

export const spawn = () => create(randomElement(KINDS))

export const startSpawning = () => {
  const chancePerTick = POWERUPS_PER_SECOND / TICKS_PER_SEC

  l2.repeat(() => {
    if (powerupRepository.count() >= MAX_POWERUPS) return
    if (Math.random() >= chancePerTick) return

    spawn()
  }, 1, { id: 'powerup_spawning' })
}
