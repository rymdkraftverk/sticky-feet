import './game'
import { prettyVersionTime } from 'common'

const version = process.env.VERSION

if (version) {
  console.log(`Version: ${version} | Time: ${prettyVersionTime(version)}`)
}
