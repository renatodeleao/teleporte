---
"teleporte": patch
---

Prevent Cross-Request State Pollution

TL;DR we use a singleton for teleports state and the module state is preserved on each request leading to teleport duplication.

See:
- https://vuejs.org/guide/scaling-up/ssr#cross-request-state-pollution
- https://portal-vue.linusb.org/guide/ssr.html

