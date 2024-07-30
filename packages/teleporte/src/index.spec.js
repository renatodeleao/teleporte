import { usePortal, TeleportPlugin } from './index.js'
import {
  describe,
  test,
  expect,
  beforeEach,
  render,
} from 'teleporte-test-utils'
import { defineComponent, ref, provide, inject, h } from 'vue'

// singleton cleanup to ensure we start fresh on every test
beforeEach(() => {
  usePortal().destroyAll()
})

const Templates = {
  basic: `
    <div id="origin">
      <TeleportOrigin to="dest">
        <div data-qa="teleported">Teleported</div>
      </TeleportOrigin>
    </div>

    <div id="target">
      <TeleportTarget name="dest" />
    </div>
  `,
  dynamic: `
    <div id="origin">
      <TeleportOrigin v-bind="teleportOriginProps">
        <div data-qa="teleported">Teleported</div>
      </TeleportOrigin>
    </div>

    <div id="target">
      <TeleportTarget v-bind="teleportTargetProps" />
    </div>
  `,
}

describe('TeleportPlugin', () => {
  test('renders correctly', () => {
    const { html } = render(Templates.basic, {
      defineComponents: false,
      plugins: [TeleportPlugin],
    })

    expect(html()).toMatchInlineSnapshot(`
      "<div id="origin">
        <!--TeleportOrigin: teleporte-0-->
      </div>
      <div id="target">
        <div data-qa="teleported">Teleported</div>
      </div>"
    `)
  })
})

describe('direct usage', () => {
  describe('render', () => {
    test('teleports correctly by default', () => {
      const { html, findTeleport } = render(Templates.basic)

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div data-qa="teleported">Teleported</div>
        </div>"
      `)

      expect(findTeleport('teleported').exists()).toBe(true)
    })

    test('when disabled true, mounts contents at origin, when false mounts at target', async () => {
      const { html, setProps } = render(Templates.dynamic, {
        props: {
          teleportOriginProps: { to: 'dest', disabled: true },
          teleportTargetProps: { name: 'dest' },
        },
      })

      expect(html()).toMatchInlineSnapshot(
        `
        "<div id="origin">
          <div data-qa="teleported">Teleported</div>
        </div>
        <div id="target"></div>"
      `,
      )

      await setProps({ teleportOriginProps: { to: 'dest', disabled: false } })
      expect(html()).toMatchInlineSnapshot(
        `
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div data-qa="teleported">Teleported</div>
        </div>"
      `,
      )
    })

    test('when target is not rendered, it content enters the portal leaving origin, but stays inside (is not rendered at Target)', async () => {
      const { html, setProps } = render({
        props: {
          teleportTargetOriginMounted: {
            type: Boolean,
            default: false,
          },
        },
        template: `
            <div id="origin">
              <TeleportOrigin to="dest">
                <div data-qa="teleported">Teleported</div>
              </TeleportOrigin>
            </div>
            <div id="target">
              <TeleportTarget v-if="teleportTargetOriginMounted" name="dest" />
            </div>
          `,
      })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <!--v-if-->
        </div>"
      `)

      await setProps({ teleportTargetOriginMounted: true })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div data-qa="teleported">Teleported</div>
        </div>"
      `)
    })

    test(`when origin is not rendered, its contents are not teleported, if content was teleported
      and origin unmounts, teleported content is unmounted from target`, async () => {
      const { html, setProps } = render({
        props: {
          teleportOriginMounted: {
            type: Boolean,
            default: false,
          },
        },
        template: `
          <div id="origin">
            <TeleportOrigin to="dest" v-if="teleportOriginMounted">
              <div data-qa="teleported">Teleported</div>
            </TeleportOrigin>
          </div>

          <div id="target">
            <TeleportTarget name="dest" />
          </div>
        `,
      })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--v-if-->
        </div>
        <div id="target"></div>"
      `)

      await setProps({ teleportOriginMounted: true })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div data-qa="teleported">Teleported</div>
        </div>"
      `)

      await setProps({ teleportOriginMounted: false })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--v-if-->
        </div>
        <div id="target"></div>"
      `)
    })

    test(`it teleports when v-if is is applied on TeleportOrigin content root`, async () => {
      const { html, setProps } = render({
        props: {
          teleportContentRendered: {
            type: Boolean,
            default: false,
          },
        },
        template: `
          <div id="origin">
            <TeleportOrigin to="dest">
              <div data-qa="teleported" v-if="teleportContentRendered">Teleported</div>
            </TeleportOrigin>
          </div>

          <div id="target">
            <TeleportTarget name="dest" />
          </div>
        `,
      })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <!--v-if-->
        </div>"
      `)

      await setProps({ teleportContentRendered: true })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div data-qa="teleported">Teleported</div>
        </div>"
      `)
    })

    test(`it teleports when v-if is is applied on TeleportOrigin content root`, async () => {
      const { html, setProps } = render({
        props: {
          teleportOriginRendered: {
            type: Boolean,
            default: false,
          },
        },
        template: `
          <div id="origin">
            <TeleportOrigin to="dest" v-if="teleportOriginRendered">
              <div data-qa="teleported">Teleported</div>
            </TeleportOrigin>
          </div>

          <div id="target">
            <TeleportTarget name="dest" />
          </div>
        `,
      })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--v-if-->
        </div>
        <div id="target"></div>"
      `)

      await setProps({ teleportOriginRendered: true })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div data-qa="teleported">Teleported</div>
        </div>"
      `)
    })

    // avoid breaking transitions
    test('it excludes comment nodes from teleported content', () => {
      const { html } = render({
        template: `
            <div id="origin">
              <TeleportOrigin to="dest">
                <!-- comment -->
                <div data-qa="teleported">Teleported</div>
                <!-- another comment -->
              </TeleportOrigin>
            </div>

            <div id="target">
              <TeleportTarget name="dest" />
            </div>
          `,
      })

      expect(html()).toMatchInlineSnapshot(`
          "<div id="origin">
            <!--TeleportOrigin: teleporte-0-->
          </div>
          <div id="target">
            <div data-qa="teleported">Teleported</div>
          </div>"
        `)
    })

    test('it renders slot fragments', () => {
      const ComponentA = defineComponent({
        name: 'ComponentA',
        template: `
          <div id="component-a">
            <div class="component-a__default">
              <slot  />
            </div>
            <div class="component-a__content">
              <slot name="content" />
            </div>
          </div>
        `,
      })

      const Example = defineComponent({
        name: 'Example',
        components: { ComponentA },
        template: `
          <div id="example">
            <div class="example__default">
              <slot />
            </div>
            <ComponentA>
              <template #default>
                <slot name="default-forward" />
              </template>

              <template #content>
                <slot name="content-forward" />
              </template>
            </ComponentA>
          </div>
        `,
      })

      const { html } = render({
        components: {
          Example,
        },
        template: `
          <div id="origin">
            <TeleportOrigin to="dest">
              <Example>
                <template #default>
                  <span>default</span>
                </template>
                <template #default-forward>
                  <span>default forward</span>
                </template>
                <template #content-forward>
                  <span>content forward</span>
                </template>
              </Example>
            </TeleportOrigin>
          </div>

          <div id="target">
            <TeleportTarget name="dest" />
          </div>
        `,
      })

      expect(html()).toMatchInlineSnapshot(`
        "<div id="origin">
          <!--TeleportOrigin: teleporte-0-->
        </div>
        <div id="target">
          <div id="example">
            <div class="example__default"><span>default</span></div>
            <div id="component-a">
              <div class="component-a__default"><span>default forward</span></div>
              <div class="component-a__content"><span>content forward</span></div>
            </div>
          </div>
        </div>"
      `)
    })
  })
})

describe('quirks tests', () => {
  test('preserves ("forwards") provide/inject context from teleport origin to target', () => {
    const Provider = defineComponent({
      name: 'Provider',
      setup(_, { slots }) {
        const providerRef = ref(42)
        provide('Provider', { providerRef })

        return () => slots.default?.()
      },
    })

    const TeleportContent = defineComponent({
      name: 'TeleportContent',
      setup() {
        const { providerRef } = inject('Provider')
        return () =>
          h(
            'div',
            { 'data-qa': 'teleported' },
            `Teleported ${providerRef?.value}`,
          )
      },
    })

    const { html } = render({
      components: { Provider, TeleportContent },
      template: `
        <div id="origin">
          <Provider>
            <TeleportOrigin to="dest">
              <TeleportContent />
            </TeleportOrigin>
          </Provider>
        </div>

        <div id="target">
          <TeleportTarget name="dest" />
        </div>
      `,
    })

    expect(html()).toMatchInlineSnapshot(`
      "<div id="origin">
        <!--TeleportOrigin: teleporte-0-->
      </div>
      <div id="target">
        <div data-qa="teleported">Teleported 42</div>
      </div>"
    `)
  })

  test.todo(
    `it works with Transition Group, (requires e2e testing to confirm)`,
    () => {},
  )
})
