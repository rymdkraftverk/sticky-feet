import * as R from 'ramda'
import * as Matter from 'matter-js'

import playerRepository from './player/repository'
import projectileRepository from './projectile/repository'
import spawnPosition from './player/spawnPosition'
import removeProjectile from './projectile/remove'
import getLeader from './getLeader'
import slow from './slow'
import { renderLeaderboard } from './leaderboard'
import state from './state'

const hoistLeading = (leaderPosition, players) => R.sort(
  R.comparator(R.pipe(
    R.path(['body', 'position']),
    R.equals(leaderPosition),
  )),
  players,
)

const projectilePlayerCollision = (playerId, projectileId) => {
  const player = playerRepository.findByBody(playerId)
  const projectile = projectileRepository.findByBody(projectileId)

  if (player.id !== projectile.firedBy) {
    slow(player.id)
    removeProjectile(projectile.id)
  }
}

const playerPlayerCollision = (idA, idB) => {
  const players = R.map(
    playerRepository.findByBody,
    [idA, idB],
  )

  const positions = R.map(
    R.path(['body', 'position']),
    players,
  )

  const leaderPosition = getLeader(...positions)

  const [
    leadingPlayer,
    trailingPlayer,
  ] = hoistLeading(
    leaderPosition,
    players,
  )

  // Respawn caught player
  Matter.Body.setPosition(
    leadingPlayer.body,
    spawnPosition(),
  )

  // Distribute score
  trailingPlayer.score += 1
  renderLeaderboard(state.players)
}

const unknownCollision = (...ids) => {
  console.log('UNKNOWN COLLISION', ids)
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
  ) || unknownCollision

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
