import * as R from 'ramda'
import state from '../state'

// -- Private ---

// eslint-disable-next-line fp/no-rest-parameters
const deferStateApplication = f => (...args) => f(state.projectiles)(...args)

const write = (x) => {
  state.projectiles = x
}

// --- Public ---
// All functions below MUST take a list of projectiles as
// their first argument. It will automatically get injected
// into the exported functions thanks to `deferStateApplication`

// --- Read ---

// [Projectile] -> Projectile id -> Projectile
const find = projectiles => id => R.find(
  R.propEq('id', id),
  projectiles,
)

// [Projectile] -> Body id -> Projectile
const findByBody = projectiles => bodyId => R.find(
  x => x.body.id === bodyId,
  projectiles,
)

// --- Write ---

// [Projectile] -> Projectile -> [Projectile]
const add = projectiles => R.pipe(
  x => [x],
  R.concat(projectiles),
  R.tap(write),
)

// [Projectile] -> Projectile id -> [Projectile]
const remove = R.curry((projectiles, id) => R.pipe(
  R.reject(R.propEq('id', id)),
  R.tap(write),
)(projectiles))

export default R.map(deferStateApplication, {
  add,
  find,
  findByBody,
  remove,
})
