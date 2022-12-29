
export function jsonLoader (source) {
  console.log('json-------------',source)
  this.addDeps("jsonLoader")
  return `export default ${JSON.stringify(source)}`
}