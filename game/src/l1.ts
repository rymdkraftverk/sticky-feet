type BehaviorCallback = (counter: number, deltaTime: number) => void

export type Behavior = {
  callback: BehaviorCallback
  counter: number
  delay?: number
  id: string | null
  interval?: number
  labels: string[]
  type: string
}

const behaviors: Behavior[] = []
let behaviorsToAdd: Behavior[] = []
let behaviorsToRemove: Behavior[] = []

const BehaviorType = {
  ONCE: 'once',
  REPEAT: 'repeat',
}

const log = (text: string) => {
  console.warn(text)
}

const commonBehaviorProperties = {
  id: null as string | null,
  labels: [] as string[],
  counter: 0,
}

export const update = (deltaTime: number) => {
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
     
    behavior.counter += 1
    if (behavior.type === BehaviorType.ONCE) {
      if (behavior.counter === behavior.delay) {
        behavior.callback(behavior.counter, deltaTime)
        behaviorsToRemove.push(behavior)
      }
    } else if (behavior.type === BehaviorType.REPEAT) {
      if (behavior.counter % (behavior.interval as number) === 0) {
        behavior.callback(behavior.counter, deltaTime)
      }
    }
  })
}

// TODO: once and repeat could share more code
export const once = (callback: BehaviorCallback, delay = 1) => {
  if (!callback || typeof callback !== 'function') {
    throw new Error('The fist argument to l1.once needs to be a function')
  }
  const behavior: Behavior = {
    callback,
    delay,
    type: BehaviorType.ONCE,
    ...commonBehaviorProperties,
  }
  behaviorsToAdd.push(behavior)
  return behavior
}

export const repeat = (callback: BehaviorCallback, interval = 1) => {
  if (!callback || typeof callback !== 'function') {
    throw new Error('The fist argument to l1.repeat needs to be a function')
  }
  const behavior: Behavior = {
    callback,
    interval,
    type: BehaviorType.REPEAT,
    ...commonBehaviorProperties,
  }
  behaviorsToAdd.push(behavior)
  return behavior
}

export const get = (id: string) => behaviors.find(behavior => behavior.id === id)

export const remove = (behavior: Behavior | string | undefined) => {
  const behaviorObject = typeof behavior === 'string' ? get(behavior) : behavior

  if (!behaviorObject) {
    log(`level1: Tried to remove non-existent behavior: ${behavior}`)
  } else {
    behaviorsToRemove.push(behaviorObject)
  }
}

export const getAll = () => behaviors
