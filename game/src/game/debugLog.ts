export default (...args: unknown[]) => {
  if (window.debug.logging) {
    console.log(...args)
  }
}
