import { useEffect, useRef } from 'react'

export default (callback: (event: Event) => void) => {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up event listener
  useEffect(() => {
    const handleShake = (e: Event) => {
      savedCallback.current(e)
    }
    window.addEventListener('shake', handleShake, true)
    return () => {
      window.removeEventListener('shake', handleShake, true)
    }
  }, [])
}
