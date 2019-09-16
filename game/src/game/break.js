import playerRepository from './player/repository'

const start = (id) => {
  const player = playerRepository.find(id)
  player.breaking = true
}

const stop = (id) => {
  const player = playerRepository.find(id)
  player.breaking = false
}

export default {
  start,
  stop,
}
