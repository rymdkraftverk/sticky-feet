export const length = ({ x, y }) => Math.sqrt((x ** 2) + (y ** 2))

export const add = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
  x: x1 + x2,
  y: y1 + y2,
})

export const subtract = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
  x: x2 - x1,
  y: y2 - y1,
})

export const scale = (factor, { x, y }) => ({
  x: factor * x,
  y: factor * y,
})

export const normalize = v => scale(1 / length(v), v)

export const rotate = (angle, { x, y }) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle),
})

export const dotProduct = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 * x2 + y1 * y2
