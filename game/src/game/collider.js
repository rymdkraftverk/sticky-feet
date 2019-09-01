import * as R from 'ramda'

import playerRepository from './player/repository'
import projectileRepository from './projectile/repository'
import removePlayer from './player/remove'
import getLeader from './getLeader'
import * as entity from './entity'

const projectilePlayerCollision = (playerId, projectileId) => {
  const player = playerRepository.findByBody(playerId)
  const projectile = projectileRepository.findByBody(projectileId)

  if (player.id !== projectile.firedBy) {
    // TODO:
    // - move to concept
    // - remove move behavior
    entity.remove(projectile)
    projectileRepository.remove(projectile.id)
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

  removePlayer(leadingPlayer.id)
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
