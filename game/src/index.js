import './game'
// @ts-ignore
import { prettyVersionTime } from '../../common'

const { VERSION } = process.env

if (VERSION) {
  console.log(`Version: ${VERSION} | Time: ${prettyVersionTime(VERSION)}`)
}
