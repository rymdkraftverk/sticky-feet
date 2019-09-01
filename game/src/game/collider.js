import playerRepository from './player/repository'
import removePlayer from './player/remove'
import getLeader from './getLeader'

const playerCollision = (playerA, playerB) => {
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
        },
        bodyB: {
          id: idB,
        },
      },
    ],
  } = event

  const playerA = playerRepository.findByBody(idA)
  const playerB = playerRepository.findByBody(idB)

  if (playerA && playerB) {
    playerCollision(playerA, playerB)
  }
}
