import { provide, getCurrentInstance } from 'vue'

/**
 * Extracts the provided context from the current instance allowing to forward
 * it into the teleported component by calling the returned function.
 * @returns {() => void}
 */
export function useProvidedContext() {
  const ctx = getCurrentInstance()

  return function forwardContext() {
    // biome-ignore lint: jsdom doesn't like for of Object.entries() and i want to test things
    Object.entries(ctx.provides).forEach(([key, context]) => {
      provide(key, context)
    })
  }
}
