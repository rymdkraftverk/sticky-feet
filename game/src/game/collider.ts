import * as Matter from 'matter-js'

import Sound from './sound'
import playerRepository from './player/repository'
import projectileRepository from './projectile/repository'
import spawnPosition from './player/spawnPosition'
import removeProjectile from './projectile/remove'
import getLeader from './getLeader'
import slow from './slow'
import updateScoreIndicators from './updateScoreIndicators'
import type { Vector } from './linearAlgebra'
import type { Player } from './types'

const isLeader = (player: Player, leaderPosition: Vector) => (
  player.body.position.x === leaderPosition.x
  && player.body.position.y === leaderPosition.y
)

const projectilePlayerCollision = (playerId: number, projectileId: number) => {
  const player = playerRepository.findByBody(playerId)
  const projectile = projectileRepository.findByBody(projectileId)

  if (player.id !== projectile.firedBy) {
    slow(player.id)
    removeProjectile(projectile.id)
    Sound.PROJECTILE_HIT.play()
  }
}

const playerPlayerCollision = (idA: number, idB: number) => {
  const players = [idA, idB].map(playerRepository.findByBody)

  const [positionA, positionB] = players.map(({ body }) => body.position)

  const leaderPosition = getLeader(positionA, positionB)

  const leadingPlayer = players.find(player => isLeader(player, leaderPosition)) as Player
  const trailingPlayer = players.find(player => !isLeader(player, leaderPosition)) as Player

  // Respawn caught player
  Matter.Body.setPosition(
    leadingPlayer.body,
    spawnPosition(),
  )
  Sound.KILL.play()

  // Distribute score
  trailingPlayer.score += 1
  updateScoreIndicators()
}

export default (event: Matter.IEventCollision<Matter.Engine>) => {
  const {
    pairs: [
      {
        bodyA,
        bodyB,
      },
    ],
  } = event

  const [first, second] = [bodyA, bodyB]
    .slice()
    .sort((a, b) => String(a.entityType).localeCompare(String(b.entityType)))

  if (first.entityType === 'player' && second.entityType === 'player') {
    playerPlayerCollision(first.id, second.id)
    return
  }

  if (first.entityType === 'player' && second.entityType === 'projectile') {
    projectilePlayerCollision(first.id, second.id)
    return
  }

  console.log('UNKNOWN COLLISION', [first.id, second.id])
}
