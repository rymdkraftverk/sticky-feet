// Vendored from pixi-ex 0.0.3 (https://github.com/sajmoni/pixi-ex)
// Copyright (c) Simon Lagos, MIT licensed

import type * as PIXI from 'pixi.js'

type ResizableText = PIXI.Text & { originalFontSize?: number }

let application: PIXI.Application | undefined
let ratio = 1
let gameWidth = 0
let gameHeight = 0

export const init = (app: PIXI.Application) => {
  gameWidth = app.renderer.width
  gameHeight = app.renderer.height

  application = app
}

const initialized = () => {
  if (!application) {
    throw new Error('ex.init has not been called')
  }
  return application
}

export const getTexture = (filename: string) => {
  const app = initialized()

  try {
    const texture = Object
      .values(app.loader.resources)
      .filter(resource => resource.textures)
      .flatMap(resource => Object.entries(resource.textures ?? {}))
      .find(([key]) => key === `${filename}.png`)

    if (!texture) {
      throw new Error('no matching texture in the loaded resources')
    }

    return texture[1]
  } catch (error) {
    throw new Error(`pixi-ex: Texture "${filename}" could not be retrieved: ${error}`)
  }
}

const getAllChildren = (displayObject: PIXI.DisplayObject): PIXI.DisplayObject[] => {
  const { children } = displayObject as PIXI.Container
  if (children?.length) {
    return children
      .flatMap(getAllChildren)
      .concat(displayObject)
  }
  return [displayObject]
}

export const resize = (width: number, height: number) => {
  const app = initialized()

  ratio = Math.min(
    width / gameWidth,
    height / gameHeight,
  )

  app
    .stage
    .scale
    .set(ratio)

  app
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
  getAllChildren(app.stage)
    // Keep if resizable text object
    .filter((c): c is ResizableText => Boolean((c as ResizableText).originalFontSize))
    .forEach((displayObject) => {
       
      displayObject.style.fontSize = (displayObject.originalFontSize as number) * ratio
      displayObject.scale.set(1 / ratio)
    })
}

export const makeResizable = (textObject: ResizableText) => {
  const fontSize = Number(textObject.style.fontSize)
   
  textObject.originalFontSize = fontSize
   
  textObject.style = {
    ...textObject.style,
    fontSize: fontSize * ratio,
  } as PIXI.TextStyle
  textObject.scale.set(1 / ratio)
}

// Convert #ff00ff to 0xff00ff
export const fromHex = (color: string) => Number(`0x${color.substring(1, color.length)}`)
