import state from '../../src/game/state'
import repo from '../../src/game/player/repository'

const PLAYERS = [
  {
    color: 'blue',
    id: 'foo',
  },
  {
    color: 'red',
    id: 'bar',
  },
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
  repo.add({
    id: 'unique',
    color: 'yellow',
  })

  expect(state.players)
    .toEqual(PLAYERS.concat({
      id: 'unique',
      color: 'yellow',
    }))
})

test('remove', () => {
  repo.remove('bar')

  expect(state.players)
    .toEqual([{
      id: 'foo',
      color: 'blue',
    }])
})
