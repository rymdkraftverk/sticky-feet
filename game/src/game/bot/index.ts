import state from '../state'
import brain from './brain'
import input from '../input'
import join, { hasRoom } from '../player/join'
import leave from '../player/leave'

const bots = () => state.players.filter(player => player.figure === 'robot')

export const add = (idSuffix = Date.now().toString()) => {
  if (!hasRoom()) return

  const id = `BOT_${idSuffix}`
  const player = join(id, 'robot')
  player.behaviors.brainId = brain(id, input(id))
}

export const remove = () => {
  const bot = bots().at(-1)
  if (bot) leave(bot.id)
}
