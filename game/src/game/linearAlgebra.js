export const add = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
  x: x1 + x2,
  y: y1 + y2,
})

export const subtract = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
  x: x2 - x1,
  y: y2 - y1,
})

export const normalize = ({ x, y }) => {
  const length = Math.sqrt((x ** 2) + (y ** 2))

  return {
    x: x / length,
    y: y / length,
  }
}

export const scale = (factor, { x, y }) => ({
  x: factor * x,
  y: factor * y,
})
