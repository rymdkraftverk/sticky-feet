import * as R from 'ramda'
import state from '../state'

// -- Private ---

// eslint-disable-next-line fp/no-rest-parameters
const deferStateApplication = f => (...args) => f(state.players)(...args)

const write = (x) => {
  state.players = x
}

// --- Public ---
// All functions below MUST take a list of players as
// their first argument. It will automatically get injected
// into the exported functions thanks to `deferStateApplication`

// --- Read ---

// [Player] -> Int
const count = players => () => R.length(players)

// [Player] -> String -> Player
const find = R.curry((players, id) => R.find(R.propEq('id', id), players))

// --- Write ---

// [Player] -> Player -> [Player]
const add = players => R.pipe(
  x => [x],
  R.concat(players),
  R.tap(write),
)

export default R.map(deferStateApplication, {
  add,
  count,
  find,
})
