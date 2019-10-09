/*
bodies = A list of MatterJS bodies, can be retrieved with Matter.Composite.allBodies(engine.world),
gfx = A PIXI.Graphics object that will be used to display the matter objects positions
lineStyle = { width, color }
*/
export default (bodies, gfx, lineStyle) => {
  const {
    color = 0x00ff00,
    width = 2,
  } = lineStyle

  gfx.clear()
  gfx.lineStyle(width, color)

  bodies.forEach(({ vertices }) => {
    vertices.forEach(({ x, y }, index) => {
      if (index === 0) {
        gfx.moveTo(x, y)
      } else {
        gfx.lineTo(x, y)
      }
    })
    gfx.lineTo(vertices[0].x, vertices[0].y)
    gfx.endFill()
  })
}
