import { effectScope, provide, getCurrentInstance } from 'vue'

/**
 * Keep states in the global scope to be reusable across Vue instances.
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 * @author Anthony Fu
 *
 * @param {() => any} stateFactory
 */
export function createGlobalState(stateFactory) {
  let initialized = false
  let state
  const scope = effectScope(true)

  return (...args) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args))
      initialized = true
    }
    return state
  }
}

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
