import * as R from 'ramda'
import * as Matter from 'matter-js'

import playerRepository from './player/repository'
import projectileRepository from './projectile/repository'
import spawnPosition from './player/spawnPosition'
import removeProjectile from './projectile/remove'
import getLeader from './getLeader'
import slow from './slow'

const projectilePlayerCollision = (playerId, projectileId) => {
  const player = playerRepository.findByBody(playerId)
  const projectile = projectileRepository.findByBody(projectileId)

  if (player.id !== projectile.firedBy) {
    slow(player.id)
    removeProjectile(projectile.id)
  }
}

const playerPlayerCollision = (idA, idB) => {
  const playerA = playerRepository.findByBody(idA)
  const playerB = playerRepository.findByBody(idB)

  const { body: { position: positionA } } = playerA
  const { body: { position: positionB } } = playerB

  const leaderPosition = getLeader(positionA, positionB)

  const leadingPlayer = leaderPosition === positionA
    ? playerA
    : playerB

  Matter.Body.setPosition(
    leadingPlayer.body,
    spawnPosition(),
  )
}

const COLLISION_MAP = {
  player: {
    player: playerPlayerCollision,
    projectile: projectilePlayerCollision,
  },
}

export default (event) => {
  const {
    pairs: [
      {
        bodyA,
        bodyB,
      },
    ],
  } = event

  const sortedColliders = R.sortBy(
    R.prop('entityType'),
    [
      bodyA,
      bodyB,
    ],
  )

  const sortedColliderTypes = R.pluck(
    'entityType',
    sortedColliders,
  )

  const collision = R.path(
    sortedColliderTypes,
    COLLISION_MAP,
  ) || console.log

  const [
    {
      id: idA,
    },
    {
      id: idB,
    },
  ] = sortedColliders

  collision(idA, idB)
}
