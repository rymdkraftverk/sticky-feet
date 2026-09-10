const behaviors = []
let behaviorsToAdd = []
let behaviorsToRemove = []

const BehaviorType = {
  ONCE: 'once',
  REPEAT: 'repeat',
}

const log = (text) => {
  console.warn(text)
}

const commonBehaviorProperties = {
  /** @type {string | null} */
  id: null,
  /** @type {string[]} */
  labels: [],
  counter: 0,
}

export const update = (deltaTime) => {
  behaviorsToAdd.forEach((behaviorToAdd) => {
    behaviors.push(behaviorToAdd)
  })

  behaviorsToAdd = []

  behaviorsToRemove.forEach((behaviorToRemove) => {
    // Mutate original array for performance reasons
    const indexToRemove = behaviors.indexOf(behaviorToRemove)
    if (indexToRemove >= 0) {
      behaviors.splice(indexToRemove, 1)
    }
  })

  behaviorsToRemove = []

  behaviors.forEach((behavior) => {
    // eslint-disable-next-line no-param-reassign
    behavior.counter += 1
    if (behavior.type === BehaviorType.ONCE) {
      if (behavior.counter === behavior.delay) {
        behavior.callback()
        behaviorsToRemove.push(behavior)
      }
    } else if (behavior.type === BehaviorType.REPEAT) {
      if (behavior.counter % behavior.interval === 0) {
        behavior.callback(behavior.counter, deltaTime)
      }
    }
  })
}

// TODO: once and repeat could share more code
export const once = (callback, delay = 1) => {
  if (!callback || typeof callback !== 'function') {
    throw new Error('The fist argument to l1.once needs to be a function')
  }
  const behavior = {
    callback,
    delay,
    type: BehaviorType.ONCE,
    ...commonBehaviorProperties,
  }
  behaviorsToAdd.push(behavior)
  return behavior
}

export const repeat = (callback, interval = 1) => {
  if (!callback || typeof callback !== 'function') {
    throw new Error('The fist argument to l1.repeat needs to be a function')
  }
  const behavior = {
    callback,
    interval,
    type: BehaviorType.REPEAT,
    ...commonBehaviorProperties,
  }
  behaviorsToAdd.push(behavior)
  return behavior
}

export const get = id => behaviors.find(behavior => behavior.id === id)

export const remove = (behavior) => {
  let behaviorObject
  if (typeof behavior === 'string') {
    behaviorObject = get(behavior)
  } else {
    behaviorObject = behavior
  }
  if (!behaviorObject) {
    log(`level1: Tried to remove non-existent behavior: ${behavior}`)
  } else {
    behaviorsToRemove.push(behaviorObject)
  }
}

export const getAll = () => behaviors
