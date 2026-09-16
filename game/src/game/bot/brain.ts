import * as l2 from 'l2'
import { Event } from 'common'

import state from '../state'
import getLeader from '../getLeader'
import playerRepository from '../player/repository'
import { lapTime } from '../autorun'
import { RADIUS as GROUND_RADIUS } from '../borderPatrol'
import { BODY_RADIUS as PLAYER_RADIUS } from '../player/create'
import { BODY_RADIUS as PROJECTILE_RADIUS } from '../projectile/create'
import { BODY_RADIUS as POWERUP_RADIUS } from '../powerup/index'
import {
  DOME_CENTER,
  FULL_JUMP_LOAD_TIME,
  PROJECTILE_SPEED,
} from '../constant'
import { add, scale } from '../linearAlgebra'
import {
  angularVelocity,
  atRadius,
  distance,
  gapAhead,
  interceptAngle,
  jumpRadii,
  orbit,
  polarAngle,
} from './predict'
import type { Message } from '../input'
import type { Player } from '../types'

const THINK_INTERVAL = 5
const REACTION = { min: 6, max: 18 }
const AIM_TIME = { min: 8, max: 20 }
const AIM_ERROR = 0.07
const SHOOT_PREY_RANGE = Math.PI * 0.7
const SHOOT_CHASER_RANGE = Math.PI * 0.25
const SHOOT_CHANCE = 0.35
const THREAT_TICKS = 36
const DODGE_CHARGE = { min: 7, max: 14 }
const DODGE_CHANCE = 0.75
const SHAKE_CHANCE = 0.3
const POWERUP_CHANCE = 0.6
const POWERUP_CHARGES = [20, 22, 24, 26, 28, 30, 32, 34, 36]
const LOWEST_JUMP = 110
const SCOPE_DISTANCE = 40
const EFFECTIVE_PROJECTILE_SPEED = Math.SQRT2 * PROJECTILE_SPEED * 0.99
const MAX_SHOT_TICKS = 90

type Plan = { at: number, message: () => Message | undefined }

const between = ({ min, max }: { min: number, max: number }) => min + Math.floor(Math.random() * (max - min + 1))

const chance = (probability: number) => Math.random() < probability

const wobble = (amount: number) => (Math.random() + Math.random() - 1) * amount

const direction = () => Math.sign(angularVelocity(state.lapTime))

const spin = (player: Player) => angularVelocity(lapTime(player.slows, player.braking))

const others = (player: Player) => state.players.filter(other => other.id !== player.id)

const nearestAhead = (player: Player) => others(player)
  .map(other => ({ other, gap: gapAhead(DOME_CENTER, direction(), player.body.position, other.body.position) }))
  .sort((a, b) => a.gap - b.gap)[0]

const nearestBehind = (player: Player) => others(player)
  .map(other => ({ other, gap: gapAhead(DOME_CENTER, direction(), other.body.position, player.body.position) }))
  .sort((a, b) => a.gap - b.gap)[0]

const isLeading = (player: Player, other: Player) => getLeader(
  state.lapTime,
  player.body.position,
  other.body.position,
) === player.body.position

const playerThreat = (player: Player) => others(player)
  .filter(other => isLeading(player, other))
  .some(other => Array
    .from({ length: THREAT_TICKS }, (_, index) => index + 1)
    .some(t => distance(
      orbit(DOME_CENTER, player.body.position, spin(player) * t),
      orbit(DOME_CENTER, other.body.position, spin(other) * t),
    ) < PLAYER_RADIUS * 2 + 4))

const projectileThreat = (player: Player) => state.projectiles
  .filter(projectile => projectile.firedBy !== player.id)
  .some(({ body }) => Array
    .from({ length: THREAT_TICKS }, (_, index) => index + 1)
    .some(t => distance(
      add(body.position, scale(t, body.velocity)),
      orbit(DOME_CENTER, player.body.position, spin(player) * t),
    ) < PLAYER_RADIUS + PROJECTILE_RADIUS + 4))

const catchesPowerup = (player: Player, charge: number) => {
  const braking = angularVelocity(lapTime(player.slows, true))
  const running = angularVelocity(lapTime(player.slows, false))
  const orbiting = -angularVelocity(state.lapTime)
  const start = polarAngle(DOME_CENTER, player.body.position)
  const radii = jumpRadii(GROUND_RADIUS, charge / FULL_JUMP_LOAD_TIME, GROUND_RADIUS, running)

  if (Math.min(...radii) < LOWEST_JUMP) return false

  return state.powerups.some(({ body }) => radii.some((radius, index) => {
    const flight = index + 1
    const bot = atRadius(DOME_CENTER, start + braking * charge + running * flight, radius)
    const powerup = orbit(DOME_CENTER, body.position, orbiting * (charge + flight))
    return distance(bot, powerup) < PLAYER_RADIUS + POWERUP_RADIUS
  }))
}

const wantsReverse = (player: Player) => {
  const ahead = nearestAhead(player)
  const behind = nearestBehind(player)
  return !!ahead && !!behind && behind.gap < ahead.gap
}

const pickTarget = (player: Player) => {
  const ahead = nearestAhead(player)
  if (ahead && ahead.gap < SHOOT_PREY_RANGE) return ahead.other

  const behind = nearestBehind(player)
  if (behind && behind.gap < SHOOT_CHASER_RANGE) return behind.other

  return undefined
}

const aimAt = (player: Player, target: Player) => interceptAngle({
  center: DOME_CENTER,
  from: player.body.position,
  target: target.body.position,
  targetAngularVelocity: spin(target),
  speed: EFFECTIVE_PROJECTILE_SPEED,
  maxTicks: MAX_SHOT_TICKS,
})

const message = (event: string, payload?: unknown) => ({ event, payload }) as Message

export default (id: string, act: (message: Message) => void) => {
  const clock = { now: 0 }
  const plans: Plan[] = []

  const schedule = (at: number, next: () => Message | undefined) => {
    plans.push({ at, message: next })
  }

  const shoot = (player: Player, target: Player) => {
    const aim = { angle: aimAt(player, target) ?? 0 }
    const drawn = clock.now + between(REACTION)

    schedule(drawn, () => {
      if (!playerRepository.has(target.id)) return undefined
      aim.angle = aimAt(player, target) ?? aim.angle
      return message(Event.ToGame.DRAG, { angle: aim.angle, distance: SCOPE_DISTANCE })
    })
    schedule(drawn + between(AIM_TIME), () => {
      if (!playerRepository.has(target.id)) return message(Event.ToGame.DRAG_END, { angle: aim.angle })
      aim.angle = (aimAt(player, target) ?? aim.angle) + wobble(AIM_ERROR)
      return message(Event.ToGame.DRAG_END, { angle: aim.angle })
    })
  }

  const jumpAfter = (charge: number, delay: number) => {
    schedule(clock.now + delay, () => message(Event.ToGame.BRAKE))
    schedule(clock.now + delay + charge, () => message(Event.ToGame.JUMP))
  }

  const think = (player: Player) => {
    if (player.slows > 0 && !player.cooldowns.shake && chance(SHAKE_CHANCE)) {
      schedule(clock.now + between(REACTION), () => message(Event.ToGame.SHAKE))
      return
    }

    if (player.grounded && (playerThreat(player) || projectileThreat(player)) && chance(DODGE_CHANCE)) {
      jumpAfter(between(DODGE_CHARGE), between(REACTION) / 2)
      return
    }

    if (player.grounded && state.powerups.length > 0 && wantsReverse(player)) {
      const charge = POWERUP_CHARGES.find(candidate => catchesPowerup(player, candidate))
      if (charge !== undefined && chance(POWERUP_CHANCE)) {
        jumpAfter(charge, 0)
        return
      }
    }

    const target = pickTarget(player)
    if (target && !player.cooldowns.projectile && chance(SHOOT_CHANCE)) {
      shoot(player, target)
    }
  }

  const behaviorId = `brain_${id}`

  l2.repeat(() => {
    clock.now += 1
    const player = playerRepository.find(id)

    const due = plans.filter(plan => plan.at <= clock.now)
    due.forEach((plan) => {
      plans.splice(plans.indexOf(plan), 1)
      const next = plan.message()
      if (next) act(next)
    })

    if (plans.length === 0 && clock.now % THINK_INTERVAL === 0) {
      think(player)
    }
  }, 1, { id: behaviorId })

  return behaviorId
}
