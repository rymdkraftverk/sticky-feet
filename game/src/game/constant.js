export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720

export const CENTER_X = GAME_WIDTH - (GAME_HEIGHT / 2)
export const CENTER_Y = GAME_HEIGHT / 2

export const DOME_X = GAME_WIDTH / 2
export const DOME_Y = 360

export const DOME_CENTER = { x: DOME_X, y: DOME_Y }

export const DEFAULT_LAP_TIME = 10 // seconds
export const TICKS_PER_SEC = 60

export const DEFAULT_PLAYER_SPRITE_SCALE = 2

export const GRAVITY_STRENTH = 1
export const MAX_JUMP_STRENGTH = 29 // Just below ceiling
export const MAX_BRAKE_JUMP_POWER = 1
export const FULL_BRAKE_TIME = TICKS_PER_SEC * 1
export const BRAKE_STRENGTH = DEFAULT_LAP_TIME * 2
export const SLOW_FACTOR = 2
export const SLOW_DURATION = TICKS_PER_SEC * 2
export const PROJECTILE_COOLDOWN = TICKS_PER_SEC * 2
export const SHAKE_COOLDOWN = TICKS_PER_SEC * 4

// Modes
export const TUTORIAL_MODE = 'tutorial'
