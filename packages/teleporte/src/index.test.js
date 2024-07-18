// sum.test.js
import { expect, test } from 'teleporte-test-utils'
import { helloWorld } from './index.js'

test('default', () => {
  expect(helloWorld()).toBe('Hello World!')
})
