# Fight

## Validate circle ci config

Install circle ci cli

`curl -fLSs https://circle.ci/cli | bash`

Validate config at `.circleci/config.yml`

`circleci config validate`

## Game

### Typescript

`npm run checkjs`

Will check the code with the typescript compiler.

_To ignore a line, add `@ts-ignore` on the line above_

### Static folder

Content in the `static` folder will be copied over to `dist` without being bundled.

### Add new sprites

You need [`texture-packer`](https://www.codeandweb.com/texturepacker/download) and `imagemagick`

1. Add a `new-image.png` or `new-image.piskel` file to `game/src/asset`

2. Run `npm run munch`

3. Texture is available using `.png`: `l1.getTexture('new-image')` or `.piskel`: `l1.getTexture('new-image-0')`
