# teleporte

## 1.0.0-rc.3

### Patch Changes

- 8d01f82: Document SSR caveats and instructions
- f43cfd5: Prevent Cross-Request State Pollution

  TL;DR we use a singleton for teleports state and the module state is preserved on each request leading to teleport duplication.

  See:

  - https://vuejs.org/guide/scaling-up/ssr#cross-request-state-pollution
  - https://portal-vue.linusb.org/guide/ssr.html

## 1.0.0-rc.2

### Patch Changes

- bd54460: Exclude comment nodes from TeleportOrigin slot

## 1.0.0-rc.1

### Patch Changes

- package metadata for prettier npm page

## 1.0.0-rc.0

### Major Changes

- Initial Release Candidate Version!

  I don't know much about versioning but since I have all the features
  i wanted for v1, i guess an rc-0 is fine — as in know one will ever
  care about it.

  Shipping it!
