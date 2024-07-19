import { usePortal } from './core'
import { describe, test, expect, beforeEach } from 'teleporte-test-utils'

// singleton cleanup to ensure we start fresh on every test
beforeEach(() => {
  usePortal().destroyAll()
})

describe('usePortal', () => {
  test('returns global state bindings', () => {
    const portal = usePortal()
    const portalAltRef = usePortal()

    expect(portal.index.value).toEqual([])
    expect(portalAltRef.index.value).toEqual([])

    const teleport = portal.create({
      key: 'foo',
      to: 'dest',
      component: {},
    })

    expect(portal.index.value).toEqual([teleport])
    expect(portalAltRef.index.value).toEqual([teleport])
  })

  describe('index', () => {
    test('is a computed array of TeleportI proxys', () => {
      const portal = usePortal()

      expect(portal.index.value).toEqual([])

      portal.create({
        key: '1',
        to: 'dest',
        component: {},
      })

      expect(portal.index.value[0]).toEqual({
        position: 0,
        key: '1',
        to: 'dest',
        disabled: false,
        component: {},
      })
    })
  })

  describe('#create', () => {
    test('appends a portal to index, returns the TeleportI proxy', () => {
      const portal = usePortal()

      expect(portal.index.value).toEqual([])

      const teleport1 = portal.create({
        key: '1',
        to: 'dest',
        component: {},
      })
      const teleport2 = portal.create({
        key: '2',
        to: 'dest',
        component: {},
      })

      expect(portal.index.value).toEqual([teleport1, teleport2])
    })

    test('inserts a portal at a given position int the index,', () => {
      const portal = usePortal()

      expect(portal.index.value).toEqual([])

      const teleport1 = portal.create({
        key: '1',
        to: 'dest',
        component: {},
      })
      const teleport2 = portal.create({
        key: '2',
        to: 'dest',
        component: {},
      })

      const teleportInsert = portal.create({
        position: 0,
        key: 'insert',
        to: 'dest',
        component: {},
      })

      expect(portal.index.value.map((t) => t.key)).toEqual([
        teleportInsert.key,
        teleport1.key,
        teleport2.key,
      ])
    })
  })

  // should we expose a method?
  describe('update by mutating the proxy object directly', () => {
    test('updates a teleport instance by mutating the returned proxy', () => {
      const portal = usePortal()

      const teleport = portal.create({
        key: '1',
        to: 'dest',
        component: {},
      })

      expect(portal.index.value).toEqual([teleport])

      teleport.to = 'new-dest'

      expect(portal.index.value[0].to).toEqual('new-dest')
    })
  })

  describe('#destroy', () => {
    test('removes a teleport from portal index', () => {
      const portal = usePortal()

      const teleport1 = portal.create({
        key: '1',
        to: 'dest',
        component: {},
      })

      expect(portal.index.value).toEqual([teleport1])

      portal.destroy(teleport1)

      expect(portal.index.value).toEqual([])
    })
  })

  describe('#destroyAll', () => {
    test('removes all teleports instances from portal index', () => {
      const portal = usePortal()

      const teleport1 = portal.create({
        key: '1',
        to: 'dest',
        component: {},
      })

      const teleport2 = portal.create({
        key: '2',
        to: 'dest',
        component: {},
      })

      expect(portal.index.value).toEqual([teleport1, teleport2])

      portal.destroyAll()
    })
  })
})
