import { provide, getCurrentInstance } from 'vue'

/**
 * Extracts the provided context from the current instance allowing to forward
 * it into the teleported component.
 * @returns
 */
export function useProvidedContext() {
  const ctx = getCurrentInstance()

  return function forwardContext() {
    Object.entries(ctx.provides).forEach(([key, context]) => {
      provide(key, context)
    })
  }
}
