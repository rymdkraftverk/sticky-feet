import * as l1 from 'l1'

import * as entity from '../entity'
import projectileRepository from './repository'

export default (id) => {
  const projectile = projectileRepository.find(id)
  const { behaviors } = projectile

  Object
    .values(behaviors)
    .forEach(l1.remove)

  entity.remove(projectile)
  projectileRepository.remove(projectile.id)
}
