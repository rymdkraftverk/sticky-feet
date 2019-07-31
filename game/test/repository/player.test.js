import state from '../../src/state'
import repo from '../../src/repository/player'

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

test('find', () => {
  expect(repo.find('foo'))
    .toEqual(PLAYERS[0])
})

// --- Write ---

test('add', () => {
  repo.add([{
    id: 'unique',
    color: 'yellow',
  }])

  expect(state.players)
    .toEqual(PLAYERS.concat({
      id: 'unique',
      color: 'yellow',
    }))
})
