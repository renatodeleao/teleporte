<script setup>
import { TeleportOrigin, TeleportTarget } from 'teleporte'
import { reactive } from 'vue'

const state = reactive({
  disabled: true,
  teleportRendered: true,
  teleportContentRendered: true,
  teleportTargetRendered: true,
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>

  <div>
    <button
      type="button"
      @click="
        () => {
          state.disabled = !state.disabled;
        }
      "
    >
      Toggle disabled
    </button>
    <button
      type="button"
      @click="state.teleportRendered = !state.teleportRendered"
    >
      Toggle rendered
    </button>
    <div>
      <pre>{{ state }}</pre>
    </div>
  </div>

  <div class="showcase">
    <div class="origin">
      <transition name="teleport-out">
        <TeleportOrigin
          v-if="state.teleportRendered"
          to="target"
          :disabled="state.disabled"
        >
          <div v-if="state.teleportContentRendered" class="teleport">
            Teleported content
          </div>
        </TeleportOrigin>
      </transition>
    </div>

    <div class="target">
      <TeleportTarget
        v-if="state.teleportTargetRendered"
        name="target"
        #default="teleported"
      >
        <transition name="teleport-in">
          <component
            v-if="teleported[0]"
            :is="teleported[0]?.component"
            :key="teleported[0]?.key"
          />
        </transition>
      </TeleportTarget>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.target,
.origin {
  width: 300px;
  height: 300px;
  display: block;
  overflow: hidden;
}

.origin::before,
.target::before {
  display: block;
  padding: 0.5em;
  font-weight: bold;
  font-size: 10px;
  font-family: monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.origin::before {
  content: "Origin";
}

.target::before {
  content: "Target";
}

.target {
  border: 2px solid tomato;
}

.origin {
  border: 2px solid lime;
}

.teleport {
  padding: 1em;
  background-color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.showcase {
  display: flex;
  gap: 100px;
}

.teleport-out-enter-active,
.teleport-out-leave-active {
  transition: all 0.5s ease;
}

.teleport-out-enter-from,
.teleport-out-leave-to {
  transform: translateX(100%);
}

.teleport-in-enter-active,
.teleport-in-leave-active {
  transition: all 0.5s ease;
}

.teleport-in-enter-from,
.teleport-in-leave-to {
  transform: translateX(-100%);
}
</style>
