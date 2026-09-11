export type Vector = { x: number, y: number }

export const length = ({ x, y }: Vector) => Math.sqrt((x ** 2) + (y ** 2))

export const add = ({ x: x1, y: y1 }: Vector, { x: x2, y: y2 }: Vector) => ({
  x: x1 + x2,
  y: y1 + y2,
})

export const subtract = ({ x: x1, y: y1 }: Vector, { x: x2, y: y2 }: Vector) => ({
  x: x2 - x1,
  y: y2 - y1,
})

export const scale = (factor: number, { x, y }: Vector) => ({
  x: factor * x,
  y: factor * y,
})

export const normalize = (v: Vector) => scale(1 / length(v), v)

export const rotate = (angle: number, { x, y }: Vector) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle),
})

export const fromPolar = (angle: number, magnitude: number) => ({
  x: magnitude * Math.cos(angle),
  y: magnitude * Math.sin(angle),
})

export const dotProduct = (
  { x: x1, y: y1 }: Vector,
  { x: x2, y: y2 }: Vector,
) => x1 * x2 + y1 * y2
