<script setup>
import { TeleportOrigin, TeleportTarget } from 'teleporte'
const disabled = ref(false)
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <button @click="disabled = !disabled">Toggle disabled</button>
    <div class="showcase">
      <div class="origin">
        <TeleportOrigin
          to="target"
          :disabled="disabled"
        >
          <div class="teleport">
            Teleported content
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
