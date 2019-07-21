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
