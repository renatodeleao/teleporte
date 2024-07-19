import { reactive, computed } from 'vue'
import { createGlobalState } from './shared'

/**
 * Global state for managing teleports.
 * @typedef {object} UsePortalReturn
 * @prop {import('vue').Reactive<{[key: TeleportI["key"]]: TeleportI}>} state
 * @prop {import('vue').ComputedRef<TeleportI[]>} index
 * @prop {function(TeleportI): TeleportI} create
 * @prop {function(TeleportI | { key: TeleportI["key"] }): void} destroy
 * @prop {function(Partial<TeleportI> & { key: TeleportI["key"]}): TeleportI} update
 */

/**
 * @type {() => UsePortalReturn}}
 */
export const usePortal = createGlobalState(() => {
  /**
   * @type {UsePortalReturn["state"]}
   */
  const state = reactive({})

  /**
   * @type {UsePortalReturn["index"]}
   */
  const index = computed(() => {
    return Object.values(state).sort((a, b) => a.position - b.position)
  })

  /** @type {UsePortalReturn["create"]} */
  function create(attributes) {
    const teleport = new Teleport({
      ...attributes,
      position: attributes.position ?? index.value.length,
    })
    state[teleport.key] = teleport
    // the reactive proxy not the original class
    return state[teleport.key]
  }

  /** @type {UsePortalReturn["destroy"]} */
  function destroy({ key }) {
    delete state[key]
  }

  /** @type {UsePortalReturn["update"]} */
  function update({ key, ...attributes }) {
    state[key] = {
      ...state[key],
      ...attributes,
    }

    return state[key]
  }

  return {
    index,
    create,
    update,
    destroy,
  }
})

/**
 * Model
 * @typedef {Object} TeleportI
 * @prop {number=} position
 * @prop {string} key
 * @prop {boolean} [disabled=false]
 * @prop {boolean} disabled
 * @prop {string} to
 * @prop {import('vue').Component} component
 */
export class Teleport {
  /** @param {TeleportI} attributes */
  constructor(attributes) {
    this.position = attributes.position
    this.key = attributes.key ?? `teleporte-${this.position}`
    this.disabled = attributes.disabled || false
    this.to = attributes.to
    this.component = attributes.component
  }
}
