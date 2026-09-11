import state from '../../src/game/state'
import repo from '../../src/game/player/repository'
import type { Player } from '../../src/game/types'

// The repository only ever looks at id, so the rest of a player is noise here
const player = (id: string, colorName: string) => ({
  id,
  color: { name: colorName, hex: '#000000' },
}) as Player

const PLAYERS = [
  player('foo', 'blue'),
  player('bar', 'red'),
]

beforeEach(() => {
  state.players = PLAYERS
})

// --- Read ---
test('count', () => {
  expect(repo.count())
    .toEqual(2)
})

test('find', () => {
  expect(repo.find('foo'))
    .toEqual(PLAYERS[0])
})

// --- Write ---

test('add', () => {
  const added = player('unique', 'yellow')
  repo.add(added)

  expect(state.players)
    .toEqual(PLAYERS.concat(added))
})

test('remove', () => {
  repo.remove('bar')

  expect(state.players)
    .toEqual([player('foo', 'blue')])
})
