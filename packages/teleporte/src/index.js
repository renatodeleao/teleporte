/**
 * @typedef {(name: string) => void} HelloWorldFn
 */
export function helloWorld(name = 'World') {
  const a = {
    a: 42,
    b: 'hello',
  }
  const arr = ['a', 'b']
  const val = `Hello ${name}!`
  console.log(val)
  return val
}
