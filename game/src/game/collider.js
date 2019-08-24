import playerRepository from './player/repository'

const playerCollision = ({ color: { name: colorA } }, { color: { name: colorB } }) => {
  console.log(`PLAYER COLLISION: ${colorA} - ${colorB}`)
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
