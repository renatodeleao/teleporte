# teleporte
Like native Vue‘s built-in `<Teleport>` component, but different.

The name "Teleporte" is the Portuguese word for **teleport**. I found it curious
how similar it was and in my mind the "e" suffix could also mean "enhanced": 
Teleport enhanced. 


# install & use

```
pnpm install teleporte
```

>[!WARNING]
>This package requires `vue@^3.2.0` to be installed.

Then Import the components.

```html
<sript setup>
import { Teleporte, TeleporteTarget } from 'teleporte'
</script>

<!-- Same API as portal-vue, in fact snippet is from their repo -->
<teleporte to="destination">
  <p>This slot content will be rendered wherever the
    <teleporte-target> with name 'destination'
    is located.
  </p>
</teleporte>

<teleporte-target name="destination">
  <!--
  This component can be located anywhere in your App
  (i.e. right before the </body> tag, good for overlays).
  The slot content of the above teleporte component will be rendered here.
  -->
</teleporte-target>
```

### Install as Vue plugin

```js
import { TeleportePlugin } from 'teleporte'
import { createApp } from 'vue'

const app = createApp()
app.use(TeleportPlugin)
// exposes Teleporte and TeleportTarget as global components
```

### Usage with TransitionGroup
```html
<sript setup>
import { Teleporte, TeleporteTarget } from 'teleporte'
</script>

<!-- Same API as portal-vue, in fact snippet is from their repo -->
<teleporte to="destination">
  <p>This slot content will be rendered wherever the
    <teleporte-target> with name 'destination'
    is located.
  </p>
</teleporte>

<teleporte-target name="destination" #default="teleported">
  <transition-group>
    <component 
      v-for="teleporte in teleported"
      :key="teleporte.key"
      :is="teleporte.component"
    />
  </transition-group>
</teleporte-target>
```


# Why another vue teleport package
Was trying to refactor some project codebase from `portal-vue` to built-in Vue‘s
`<teleport>` component and couldn't make it work with `TransitionGroup`. After 
a discussion on a [Vue-related issue](https://github.com/vuejs/core/issues/5836#issuecomment-2230343828),
I realized that it was a limitation due to its implementation.

I decided to keep `portal-vue` in the project, but there were also [some caveats](https://portal-vue.linusb.org/guide/caveats.html)
with its implementation and my curiosity took over and I decided to implement a 
very minimalistic version of a portal myself.

The original version started as a [Vue playground](https://play.vuejs.org/#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), which I've then translated into this more generic package.

### Motivational quirks
This is not a feature parity conversion, these are the quirks in the other Vue 
"teleport" implementations that motivated me to build this package in the first place. 

>[!TIP] `portal-vue` is the more powerful/feature complete and battle tested
> solution out there and you should use it if you need more features.

| Quirks list                                              | Vue's `<teleport>` | `portal-vue` | `teleporte`          |
|----------------------------------------------------------|--------------------|--------------|----------------------|
| Works when target is mounted after teleport              | x⁵                 | ✔️            | ✔️                    |
| Teleported content can use provide/inject origin context | ✔️                  | x            | ✔️                    |
| Teleport Target can use `<TransitionGroup>`              | x                  | ✔️¹           | ✔️¹                   |
| use of $parent                                           | (TBD)              | x            | (TBD)                |
| vue-router view                                          | (TBD)              | x            | x (will not support) |
| use of $refs                                             | ✔️                  | ✔️²           | ✔️³                   |
| SSR support                                              | ✔️⁴                 | ✔️⁴           | x (TBD)              |

<small>

1. Requires usage of target componentn `#default` slot bindings and loop over 
   exposed vnodes  directly into `TransitionGroup` default slot
1. after `nextTick` (see caveats in docs)
1. to assert the need for `nextTick`
1. Yes with caveats
1. Will be supported [without workarounds in 3.5.x minor](https://github.com/vuejs/core/pull/11387)

</small>


# Contribute
See the guide at [CONTRIBUTING.md](./CONTRIBUTING.md)

# Goals
- This project aims to be a minimalistic alternative to `<teleport>`: 
  - bundle size to be kept below `1.3KB gzip`. The core — the global state 
    management imperative API is around `0.48kb gzip`.
  - No unnecessary features: it should do one thing and do it well, move content
    between two vnodes.
- To be deprecated if `Vue` teleport adds fixes to the current quirks 
  - [x] https://github.com/vuejs/core/issues/2015
  - [ ] https://github.com/vuejs/core/issues/4737
  - [ ] https://github.com/vuejs/core/issues/5836#issuecomment-2230343828 :)
  - [ ] https://github.com/vuejs/core/issues/5864

# Credits

- `portal-vue`, the main inspiration for this package implementation
- Vue‘s `teleport`  quirks for the motivation to do it
- `@vueuse/core` - `createGlobalState` is used as `teleporte` global state manager 
- To all maintainers from the packages in dependencies.