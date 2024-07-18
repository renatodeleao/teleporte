import Teleporte from './Teleporte.vue'
import TeleporteTarget from './TeleporteTarget.vue'

export const plugin = {
  install(app) {
    app.component('Teleporte', Teleporte)
    app.component('TeleporteTarget', TeleporteTarget)
  },
}
