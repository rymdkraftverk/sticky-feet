import playerRepository from './player/repository'
import removePlayer from './player/remove'
import getLeader from './getLeader'

const playerCollision = (idA, idB) => {
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

export default (event) => {
  const {
    pairs: [
      {
        bodyA: {
          id: idA,
          entityType: typeA,
        },
        bodyB: {
          id: idB,
          entityType: typeB,
        },
      },
    ],
  } = event

  if (typeA === 'player' && typeB === 'player') {
    playerCollision(idA, idB)
  }
}
