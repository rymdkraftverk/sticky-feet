import * as entity from '../entity'
import projectileRepository from './repository'

export default (id) => {
  const projectile = projectileRepository.find(id)

  entity.remove(projectile)
  projectileRepository.remove(projectile.id)
}
