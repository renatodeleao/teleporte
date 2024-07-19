import { reactive, computed } from 'vue'

/**
 * {@link https://www.totaltypescript.com/concepts/the-prettify-helper}
 * @template T
 * @typedef {{[K in keyof T]: T[K] & {}}} Prettify
 */

/**
 * Global state for managing teleports.
 * @typedef {Prettify<
 *   Partial<TeleportI> &
 *   {
 *     to: TeleportI["to"],
 *     component: TeleportI["component"],
 *   }
 * >} TeleportCreateAttrs
 *
 * @typedef {import('vue').Reactive<{[key: TeleportI["key"]]: TeleportI}>} State

 * @typedef {object} UsePortalReturn
 * @prop {import('vue').ComputedRef<TeleportI[]>} index
 * @prop {function(TeleportCreateAttrs): TeleportI} create
 * @prop {function(TeleportI | { key: TeleportI["key"] }): void} destroy
 * @prop {function(): void} destroyAll - prune state
 */

/**
 * @type {() => UsePortalReturn>}}
 */
export const usePortal = (() => {
  /**
   * @type {State}
   */
  const state = reactive({})

  /**
   * @type {UsePortalReturn["index"]}
   */
  const index = computed(() => {
    return Object.values(state)
      .sort((a, b) => {
        const n = a.position - b.position
        return n === 0 ? -1 : n
      })
      .map((record, index) => {
        // shady, ensure that positions updated after insert
        record.position = index
        return record
      })
  })

  return () => {
    /** @type {UsePortalReturn["create"]} */
    function create(attributes) {
      const teleport = Teleport({
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

    /** @type {UsePortalReturn["destroyAll"]} */
    function destroyAll() {
      for (const key in state) {
        delete state[key]
      }
    }

    return {
      index,
      create,
      destroy,
      destroyAll,
    }
  }
})()

/**
 * "Model" Factory
 * @typedef {Object} TeleportI
 * @prop {number} position
 * @prop {string} key
 * @prop {boolean} [disabled=false]
 * @prop {string} to
 * @prop {object} component
 *
 * @typedef {Prettify<
 *   Partial<TeleportI> &
 *   {
 *     position: TeleportI["position"],
 *     to: TeleportI["to"],
 *     component: TeleportI["component"],
 *   }
 * >} TeleportRequiredAttrs
 *
 * @param {TeleportRequiredAttrs} attributes
 * @return {TeleportI}
 */
export function Teleport(attributes) {
  return {
    position: attributes.position,
    key: attributes.key ?? `teleporte-${attributes.position}`,
    disabled: attributes.disabled || false,
    to: attributes.to,
    component: attributes.component,
  }
}
