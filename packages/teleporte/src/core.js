import { reactive, computed } from 'vue'
import { createGlobalState } from './shared'

/**
 * Global state for managing teleports.
 * @typedef {object} UseTeleporteReturn
 * @prop {import('vue').Reactive<{[key: Teleported["key"]]: Teleported}>} state
 * @prop {import('vue').ComputedRef<Teleported[]>} index
 * @prop {function(TeleportedAttrs): Teleported} create
 * @prop {function(TeleportedAttrs | { key: Teleported["key"] }): void} destroy
 * @prop {function(Partial<TeleportedAttrs> & { key: Teleported["key"]}): Teleported} update
 */

/**
 * @type {() => UseTeleporteReturn}}
 */
export const useTeleporte = createGlobalState(() => {
  /**
   * @type {UseTeleporteReturn["state"]}
   */
  const state = reactive({})

  /**
   * @type {UseTeleporteReturn["index"]}
   */
  const index = computed(() => {
    return Object.values(state).sort((a, b) => a.createdAt - b.createdAt)
  })

  /** @type {UseTeleporteReturn["create"]} */
  function create(attributes) {
    const teleport = new Teleporte(attributes)
    state[teleport.key] = teleport
    // the reactive proxy not the original class
    return state[teleport.key]
  }

  /** @type {UseTeleporteReturn["destroy"]} */
  function destroy({ key }) {
    delete state[key]
  }

  /** @type {UseTeleporteReturn["update"]} */
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
 * @typedef {Object} Teleported
 * @prop {string} createdAt
 * @prop {string} key
 * @prop {boolean} [disabled=false]
 * @prop {boolean} disabled
 * @prop {string} to
 * @prop {import('vue').Component} component
 *
 * @typedef {Omit<Teleported, "createdAt">} TeleportedAttrs
 */
class Teleporte {
  /** @param {TeleportedAttrs} attributes */
  constructor(attributes) {
    this.createdAt = new Date().toISOString()
    this.key = attributes.key ?? this.createdAt
    this.disabled = attributes.disabled
    this.to = attributes.to
    this.component = attributes.component
  }
}
