export * from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { TeleportOrigin, TeleportTarget } from '../src/index.js'

/**
 * @param {string|import('vue').ComponentOptions} template
 * @param {{
 *  defineComponents?: boolean,
 *  plugins?: import('vue').Plugin[]
 *  components?: import('vue').ComponentOptions['components']
 *  props?: import('vue').ComponentOptions['components']
 * }} [options={}]
 */
export function render(template, options = {}) {
  const { defineComponents = true, plugins, props } = options

  const rest = typeof template === 'string' ? { template } : template
  const component = defineComponent({
    name: 'TeleportTestWrapper',
    ...rest,
    components: defineComponents
      ? { TeleportOrigin, TeleportTarget, ...rest.components }
      : rest.components,
    props: {
      teleportOriginProps: Object,
      teleportTargetProps: Object,
      ...rest?.props,
    },
  })

  const wrapper = mount(component, {
    props,
    global: {
      plugins,
    },
  })

  return {
    wrapper,
    html: () => wrapper.html(),
    setProps: (props) => wrapper.setProps(props),
    nextTick,
    findTeleport: (id) => wrapper.find(`[data-qa="${id}"]`),
    findComponent: (component) => wrapper.findComponent(component),
  }
}
