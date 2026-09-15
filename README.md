# Sticky Feet


## Game

### Typescript

`npm run typecheck`

Will check the code with the typescript compiler.

_To ignore a line, add `@ts-ignore` on the line above_

### Public folder

Content in the `public` folder will be copied over to `dist` without being bundled.

### Add new sprites

Sprites are drawn as SVG in `game/art`, one file per frame at the size it shows on
screen, and `npm run art` packs them into `public/spritesheet/main.png` and
`main.json` at twice that size. It needs `deno` and `imagemagick`, both in the
dev shell.

1. Add `new-image.svg` to `game/art` with an integer `width` and `height` on
   the root element

2. Run `npm run art` in `game` and commit the sheet

3. Texture is available as `l2.getTexture('new-image')`

The astronaut frames are layered: `rim` under, `suit` (drawn white and tinted
with the player colour at runtime) and `gear` on top. `art/build.ts` lists which
files are layered and renders each layer to its own frame, `new-image-suit` and
so on.
