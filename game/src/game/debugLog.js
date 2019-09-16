export default (...args) => {
  // @ts-ignore
  if (window.debug.logging) {
    console.log(...args)
  }
}
