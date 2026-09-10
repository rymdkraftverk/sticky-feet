// Vendored from pixi-ex 0.0.3 (https://github.com/sajmoni/pixi-ex)
// Copyright (c) Simon Lagos, MIT licensed

let application
let ratio = 1
let gameWidth
let gameHeight

export const init = (app) => {
  gameWidth = app.renderer.width
  gameHeight = app.renderer.height

  application = app
}

const throwErrorIfNoInit = () => {
  if (!application) {
    throw new Error('ex.init has not been called')
  }
}

export const getTexture = (filename) => {
  throwErrorIfNoInit()

  try {
    const texture = Object
      .values(application.loader.resources)
      .filter(resource => resource.textures)
      .flatMap(resource => Object.entries(resource.textures))
      .find(([key]) => key === `${filename}.png`)

    return texture[1]
  } catch (error) {
    throw new Error(`pixi-ex: Texture "${filename}" could not be retrieved: ${error}`)
  }
}

const getAllChildren = (displayObject) => {
  if (displayObject.children.length) {
    return displayObject.children
      .flatMap(getAllChildren)
      .concat(displayObject)
  }
  return [displayObject]
}

export const resize = (width, height) => {
  throwErrorIfNoInit()

  ratio = Math.min(
    width / gameWidth,
    height / gameHeight,
  )

  application
    .stage
    .scale
    .set(ratio)

  application
    .renderer
    .resize(
      gameWidth * ratio,
      gameHeight * ratio,
    )

  /*
      The following code is needed to counteract the scale change on the whole canvas since
      texts get distorted by PIXI when you try to change their scale.
      Texts instead change size by setting their fontSize.
    */
  getAllChildren(application.stage)
    // Keep if resizable text object
    .filter(c => c.originalFontSize)
    .forEach((displayObject) => {
      // eslint-disable-next-line no-param-reassign
      displayObject.style.fontSize = displayObject.originalFontSize * ratio
      displayObject.scale.set(1 / ratio)
    })
}

export const makeResizable = (textObject) => {
  // This will probably break typechecking
  // eslint-disable-next-line no-param-reassign
  textObject.originalFontSize = textObject.style.fontSize
  // eslint-disable-next-line no-param-reassign
  textObject.style = {
    ...textObject.style,
    fontSize: textObject.style.fontSize * ratio,
  }
  textObject.scale.set(1 / ratio)
}

// Convert #ff00ff to 0xff00ff
export const fromHex = color => Number(`0x${color.substring(1, color.length)}`)
