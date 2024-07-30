<script setup>
import { TeleportOrigin, TeleportTarget } from 'teleporte'
const isClient = ref(false)
const disabled = ref(false)

// prevent hydration mismatch
// or use <client-only /> component
onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <button @click="disabled = !disabled">Toggle disabled</button>
    <div class="showcase">
      <div class="origin">
        <TeleportOrigin
          v-if="isClient"
          to="target"
          :disabled="disabled"
        >
          <div class="teleport">
            Teleported content
          </div>
        </TeleportOrigin>
        <TeleportOrigin
          to="target"
        >
          <div class="teleport">
            Hidration Mismatch
          </div>
        </TeleportOrigin>
      </div>

      <div class="target">
        <TeleportTarget
          name="target"
        />
      </div>
    </div>
  </div>
</template>

<style>
.origin, .target {
  height: 100px;
}
.origin { border: 1px solid red; }
.target { border: 1px solid blue; }
</style>
