<script setup>
import { computed } from 'vue'
import { usePortal } from './core.js'

const props = defineProps({
  name: String,
})

const { index } = usePortal()

const teleported = computed(() => {
  return index.value.filter(
    (teleport) => teleport.to === props.name && teleport.disabled === false,
  )
})
</script>

<template>
  <slot v-bind="teleported">
    <component
      v-for="teleport in teleported" :key="teleport.key"
      :is="teleport.component"
    />
  </slot>
</template>