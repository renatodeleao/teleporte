import TeleportOrigin from './TeleportOrigin.vue'
import TeleportTarget from './TeleportTarget.vue'

export const plugin = {
  install(app) {
    app.component('TeleportOrigin', TeleportOrigin)
    app.component('TeleportTarget', TeleportTarget)
  },
}
