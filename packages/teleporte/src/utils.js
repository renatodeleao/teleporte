import { provide, getCurrentInstance } from 'vue'

/**
 * Extracts the provided context from the current instance allowing to forward
 * it into the teleported component by calling the returned function.
 * @returns {() => void}
 */
export function useProvidedContext() {
  const ctx = getCurrentInstance()

  return function forwardContext() {
    // @ts-ignore
    for ([key, context] of Object.entries(ctx.provides)) {
      // @ts-ignore
      provide(key, context)
    }
  }
}
