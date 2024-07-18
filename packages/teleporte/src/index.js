/**
 * @typedef {(name: string) => void} HelloWorldFn
 */
export function helloWorld(name = 'World') {
  const val = `Hello ${name}!`
  console.log(val)
  return val
}

