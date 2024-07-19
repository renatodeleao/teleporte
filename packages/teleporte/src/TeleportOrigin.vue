<script>
import {
  h,
  defineComponent,
  markRaw,
  Comment,
  onBeforeUnmount,
  watch,
} from 'vue'
import { useProvidedContext } from './shared.js'
import { usePortal } from './core.js'

/**
 * @note [A]
 *   Slot content is always an an array of nodes even when just one is passed.
 *   This will break things like Transition/TransitionGroup so we "auto-unwrap"
 *   the node when a single one is passed so that it work out of the box with
 *   Transition/TransitionGroup components.
 * @todo filter fragments + user comment nodes
 *   https://github.com/radix-vue/radix-vue/blob/ddb9ebc602730403c0632800d676c359b0768fff/packages/radix-vue/src/Primitive/Slot.ts#L12
 *   https://github.com/tailwindlabs/headlessui/blob/f3353728bdae88cd352e6fb15c4c2992f3a65ed9/packages/%40headlessui-vue/src/utils/render.ts#L111
 */
export default defineComponent({
  name: 'AppTeleport',
  props: {
    disabled: Boolean,
    to: {
      String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { create, destroy } = usePortal()
    const forwardContext = useProvidedContext()

    const renderPlaceholder = () => h(Comment, `AppTeleport: ${teleport.key}`)
    // NOTE [A]
    const renderContent = () => {
      const children = slots.default?.() || []
      return children.length === 1 ? children[0] : children
    }

    const component = defineComponent({
      name: 'AppTeleportWrapper',
      setup() {
        forwardContext()

        return () => {
          return props.disabled ? renderPlaceholder() : renderContent()
        }
      },
    })

    const teleport = create({
      to: props.to,
      disabled: props.disabled,
      component: markRaw(component),
    })

    watch(
      () => [props.to, props.disabled],
      ([newVal]) => (teleport.to = newVal),
    )

    watch(
      () => props.disabled,
      (newVal) => (teleport.disabled = newVal),
    )

    onBeforeUnmount(() => {
      destroy(teleport)
    })

    return () => (props.disabled ? renderContent() : renderPlaceholder())
  },
})
</script>

